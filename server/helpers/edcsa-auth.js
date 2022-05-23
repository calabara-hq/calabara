const dotenv = require('dotenv')
const utils = require('web3-utils')
const ethereumjsUtil = require('ethereumjs-util')
const elliptic = require('elliptic')
const secp256k1 = new (elliptic.ec)("secp256k1")
const Bytes = require('./bytes')
const { keccak256, keccak256s } = require("./hash");
const { Buffer } = require ('node:buffer');

dotenv.config();


// implementation of elliptic curve to bypass infura / unreliable ethUtils recovery

const hashMessage = (data) => {
    var messageHex = utils.isHexStrict(data) ? data : utils.utf8ToHex(data);
    var messageBytes = utils.hexToBytes(messageHex);
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x19Ethereum Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    return ethereumjsUtil.bufferToHex(ethereumjsUtil.keccak256(ethMessage));
};


const toChecksum = address => {
    const addressHash = keccak256s(address.slice(2));
    let checksumAddress = "0x";
    for (let i = 0; i < 40; i++)
        checksumAddress += parseInt(addressHash[i + 2], 16) > 7
            ? address[i + 2].toUpperCase()
            : address[i + 2];
    return checksumAddress;
}


const decodeSignature = (hex) => [
    Bytes.slice(64, Bytes.length(hex), hex),
    Bytes.slice(0, 32, hex),
    Bytes.slice(32, 64, hex)];


const recover = (hash, signature) => {
    const vals = decodeSignature(signature);
    const vrs = { v: Bytes.toNumber(vals[0]), r: vals[1].slice(2), s: vals[2].slice(2) };
    const ecPublicKey = secp256k1.recoverPubKey(new Buffer.from(hash.slice(2), "hex"), vrs, vrs.v < 2 ? vrs.v : 1 - (vrs.v % 2)); // because odd vals mean v=0... sadly that means v=0 means v=1... I hate that
    const publicKey = "0x" + ecPublicKey.encode("hex", false).slice(2);
    const publicHash = keccak256(publicKey);
    const address = toChecksum("0x" + publicHash.slice(-40));
    return address;
}


const verifySignature = async (sig, msg, walletAddress) => {

        let msgHash = hashMessage(msg)
        let signer = recover(msgHash, sig)
        return (signer === walletAddress)

}


module.exports.verifySignature = verifySignature;

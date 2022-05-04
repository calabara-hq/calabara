const dotenv = require('dotenv')
const ethUtil = require('ethereumjs-util')

dotenv.config();

const verifySignature = async (sig, msg, walletAddress) => {
    let hexMsg = ethUtil.fromUtf8(msg)
    const msgBuffer = ethUtil.toBuffer(hexMsg);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(sig);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const signer = ethUtil.toChecksumAddress(ethUtil.bufferToHex(addressBuffer));
    console.log('signer here', signer)
    return(signer === walletAddress)


}


module.exports.verifySignature = verifySignature;

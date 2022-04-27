const dotenv = require('dotenv')
const db = require('./db-init.js')
const ethUtil = require('ethereumjs-util')


dotenv.config();



function clean(data) {
    if (data.rows.length == 0) { return null }
    else if (data.rows.length == 1) { return data.rows[0] }
    else { return data.rows }

}



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
    return(signer === walletAddress)


}

// verify that a message was signed by a certain wallet, as well as whether they are an admin or not.
const verifySignerIsAdmin = async (sig, msg, walletAddress, ens) => {
    let signer = await verifySignature(sig, msg, walletAddress)

    // pull the admin addresses from db and check that user is admin
    let admins = await db.query('select addresses from organizations where ens = $1', [ens])
    for (var i in admins.adresses) {
        if (admins.addresses[i] === signer) {
            return true
        }
    }
    return false
}

module.exports.verifySignature = verifySignature;
module.exports.verifySignerIsAdmin = verifySignerIsAdmin;
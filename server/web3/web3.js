const Web3 = require('web3');
const dotenv = require('dotenv')
const abi = require('./token-abi')
dotenv.config();


const INFURA_KEY = process.env.INFURA_KEY;
let web3Infura = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY));



const checkWalletTokenBalance = async (walletAddress, contractAddress, decimal) => {
    const tokenContract = new web3Infura.eth.Contract(abi.token_abi, contractAddress);
    const balance = await tokenContract.methods.balanceOf(walletAddress).call();
    const adjusted = balance / 10 ** decimal
    return adjusted;
}

module.exports = {checkWalletTokenBalance}
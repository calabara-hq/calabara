const Web3 = require('web3');
const EthDater = require('ethereum-block-by-date')
const dotenv = require('dotenv')
const abi = require('./token-abi')
dotenv.config();


const INFURA_KEY = process.env.INFURA_KEY;
let web3Infura = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY));
let dater = new EthDater(
    web3Infura
)


const checkWalletTokenBalance = async (walletAddress, contractAddress, decimal, block_num) => {
    const tokenContract = new web3Infura.eth.Contract(abi.token_abi, contractAddress);
    const balance = await tokenContract.methods.balanceOf(walletAddress).call({}, block_num);
    const adjusted = balance / 10 ** decimal
    return adjusted;
}

const calculateBlock = async (date) => {
    let block = await dater.getDate(date, true, false)
    return block.block
}

module.exports = { checkWalletTokenBalance, calculateBlock }
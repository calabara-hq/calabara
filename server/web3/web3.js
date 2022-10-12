const ethers = require('ethers')
const EthDater = require('ethereum-block-by-date')
const dotenv = require('dotenv')
const abi = require('./token-abi')
dotenv.config();

/*
const INFURA_KEY = process.env.INFURA_KEY;
let web3Infura = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY));
let dater = new EthDater(
    web3Infura
)
*/

const provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)


let dater = new EthDater(
    provider
)


const checkWalletTokenBalance = async (walletAddress, contractAddress, decimal, block_num) => {
    const tokenContract = new ethers.Contract(contractAddress, abi.token_abi, provider);
    const balance = await tokenContract.functions.balanceOf(walletAddress, { blockTag: block_num });
    const adjusted = balance / 10 ** decimal;
    return adjusted
}


const calculateBlock = async (date) => {
    let block = await dater.getDate(date, true, false)
    return block.block
}

module.exports = { checkWalletTokenBalance, calculateBlock }
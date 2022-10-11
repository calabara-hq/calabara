import { erc20abi } from '../wallet/erc20abi';
import { erc721abi } from '../wallet/erc721abi';
import { ethers } from "ethers";

const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
const provider = new ethers.providers.AlchemyProvider('homestead', process.env.REACT_APP_ALCHEMY_KEY)




export default function useContract() {


    async function erc20GetSymbolAndDecimal(contractAddress) {
        const tokenContract = new ethers.Contract(contractAddress, erc20abi, provider)
        const symbol = await tokenContract.methods.symbol().call();
        const decimal = await tokenContract.methods.decimals().call();

        return [symbol, decimal]
    }

    async function erc721GetSymbol(contractAddress) {
        const tokenContract = new ethers.Contract(contractAddress, erc20abi, provider)
        const symbol = await tokenContract.methods.symbol().call();
        return symbol
    }

    // check balance of token given a wallet address and a contract address
    async function checkERC20Balance(walletAddress, contractAddress, decimal) {
        const tokenContract = new ethers.Contract(contractAddress, erc20abi, provider)
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();
        const adjusted = balance / 10 ** decimal
        return adjusted;
    }


    async function checkERC721Balance(walletAddress, contractAddress) {
        const tokenContract = new ethers.Contract(contractAddress, erc721abi, provider)
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();
        return +balance;
    }

    //////////////////////// Refactored Functions Begin ////////////////////////

    // use this function for both erc721 and erc20. If decimal call fails but we have a symbol, use decimal of 0

    async function tokenGetSymbolAndDecimal(contractAddress) {
        const tokenContract = new ethers.Contract(contractAddress, erc20abi, provider)
        const symbol = await tokenContract.methods.symbol().call();
        let decimal = '0'
        try {
            decimal = await tokenContract.methods.decimals().call();
            return [symbol, decimal]
        } catch (e) {
            return [symbol, decimal]
        }
    }

    // check token for erc721 compliance. erc20's should fail and all erc721's should pass.
    // Mainly used for UI purposes
    async function isERC721(contractAddress) {
        try {
            const tokenContract = new ethers.Contract(contractAddress, erc721abi, provider)
            await tokenContract.methods.ownerOf(0).call();
            return true
        } catch (e) {
            return false
        }
    }

    // check balance of token given a wallet address and a contract address and decimal
    async function checkWalletTokenBalance(walletAddress, contractAddress, decimal) {
        const tokenContract = new ethers.Contract(contractAddress, erc20abi, provider)
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();
        const adjusted = balance / 10 ** decimal
        return adjusted;
    }

    //////////////////////// Refactored Functions End ////////////////////////


    return {
        erc20GetSymbolAndDecimal: async (contractAddress) => {
            return await erc20GetSymbolAndDecimal(contractAddress)
        },
        erc721GetSymbol,
        tokenGetSymbolAndDecimal: async (contractAddress) => {
            return await tokenGetSymbolAndDecimal(contractAddress)
        },
        checkERC20Balance: async (walletAddress, contractAddress, decimal) => {
            return await checkERC20Balance(walletAddress, contractAddress, decimal)
        },
        checkERC721Balance,
        checkWalletTokenBalance: async (walletAddress, contractAddress, decimal) => {
            return await checkWalletTokenBalance(walletAddress, contractAddress, decimal)
        },
        isERC721: async (contractAddress) => {
            return await isERC721(contractAddress)
        }

    }

}
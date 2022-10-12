import { tokenAbi } from "../wallet/token-abi";
import { ethers } from "ethers";

const provider = new ethers.providers.AlchemyProvider('homestead', process.env.REACT_APP_ALCHEMY_KEY)




export default function useContract() {


    // use this function for both erc721 and erc20. If decimal call fails but we have a symbol, use decimal of 0

    async function tokenGetSymbolAndDecimal(contractAddress) {
        const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider)
        const symbol = await tokenContract.functions.symbol();
        let decimal = '0'
        try {
            decimal = await tokenContract.functions.decimals();
            return [symbol, decimal]
        } catch (e) {
            return [symbol, decimal]
        }
    }

    // check token for erc721 compliance. erc20's should fail and all erc721's should pass.
    // Mainly used for UI purposes
    async function isERC721(contractAddress) {
        try {
            const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider)
            await tokenContract.functions.ownerOf(0);
            return true
        } catch (e) {
            return false
        }
    }

    // check balance of token given a wallet address and a contract address and decimal
    async function checkWalletTokenBalance(walletAddress, contractAddress, decimal) {
        try {
            const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider)
            const balance = await tokenContract.functions.balanceOf(walletAddress);
            const adjusted = balance / 10 ** decimal
            return adjusted;
        } catch (err) { return 0 }

    }

    //////////////////////// Refactored Functions End ////////////////////////


    return {
        tokenGetSymbolAndDecimal: async (contractAddress) => {
            return await tokenGetSymbolAndDecimal(contractAddress)
        },
        checkWalletTokenBalance: async (walletAddress, contractAddress, decimal) => {
            return await checkWalletTokenBalance(walletAddress, contractAddress, decimal)
        },
        isERC721: async (contractAddress) => {
            return await isERC721(contractAddress)
        }

    }

}
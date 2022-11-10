import { tokenAbi } from "../wallet/token-abi";
import { ERC165ABI, ERC1155Interface, ERC721Interface } from "../wallet/erc165abi";
import { ERC1155_abi } from "../wallet/erc1155-abi";
import { ethers } from "ethers";

const provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_KEY)

export default function useContract() {


    // use this function for both erc721 and erc20. If decimal call fails but we have a symbol, use decimal of 0

    async function tokenGetSymbolAndDecimal(contractAddress) {
        const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider)
        const symbol = await tokenContract.functions.symbol();
        let decimal = '0'
        try {
            decimal = await tokenContract.functions.decimals();
            return [symbol[0], decimal[0]]
        } catch (e) {
            return [symbol[0], decimal[0]]
        }
    }

    async function getTokenStandard(contractAddress) {
        try {
            const tokenContract = new ethers.Contract(contractAddress, ERC165ABI, provider)
            //await tokenContract.functions.ownerOf(0);
            let result = await tokenContract.functions.supportsInterface(ERC721Interface)
            if (result[0]) return 'erc721'
            else {
                let result = await tokenContract.functions.supportsInterface(ERC1155Interface)
                if (result[0]) return 'erc1155'
            }
        } catch (e) { return 'erc20' }
    }

    async function isValidERC1155TokenId(contractAddress, token_id) {
        try {
            const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider)
            await tokenContract.functions.uri(token_id)
            return true
        } catch (err) {
            return false
        }
    }

    async function checkWalletTokenBalance(walletAddress, contractAddress, decimal, token_id) {
        try {
            let balance
            if (!token_id) {
                let tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider);
                balance = await tokenContract.functions.balanceOf(walletAddress);
            }
            else {
                console.log(contractAddress)
                let tokenContract = new ethers.Contract(contractAddress, ERC1155_abi, provider);
                balance = await tokenContract.functions.balanceOf(walletAddress, token_id);

            };
            const adjusted = balance / 10 ** decimal;
            return adjusted
        } catch (err) {
            console.log(err)
            return 0
        }

    }

    //////////////////////// Refactored Functions End ////////////////////////


    return {
        tokenGetSymbolAndDecimal: async (contractAddress) => {
            return await tokenGetSymbolAndDecimal(contractAddress)
        },
        checkWalletTokenBalance: async (walletAddress, contractAddress, decimal, token_id) => {
            return await checkWalletTokenBalance(walletAddress, contractAddress, decimal, token_id)
        },
        getTokenStandard: async (contractAddress) => {
            return await getTokenStandard(contractAddress)
        },
        isValidERC1155TokenId: async (contractAddress, token_id) => {
            return await isValidERC1155TokenId(contractAddress, token_id)
        }

    }

}
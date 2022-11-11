import { tokenAbi } from "../wallet/token-abi";
import { ERC165ABI, ERC1155Interface, ERC721Interface } from "../wallet/erc165abi";
import { ERC1155_abi } from "../wallet/erc1155-abi";
import { ethers } from "ethers";

const provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_KEY)

export default function useContract() {


    async function tokenGetSymbolAndDecimal(contractAddress, tokenStandard) {
        console.log('getting symbol and decimal')
        const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider)
        let symbol = await tokenContract.functions.symbol()
            .then(data => data[0])
            .catch(err => {
                console.log(tokenStandard)
                if (tokenStandard === 'erc1155') return ''
            })


        let decimal = await tokenContract.functions.decimals()
            .then(data => data[0])
            .catch(err => {
                if (tokenStandard !== 'erc20') return '0'
            })

        console.log(symbol, decimal)
        return [symbol, decimal]
    }

    async function getTokenStandard(contractAddress) {
        try {
            const tokenContract = new ethers.Contract(contractAddress, ERC165ABI, provider)
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
            let uri = await tokenContract.functions.uri(token_id)
                .then(data => data[0])
            // check if uri looks like a uri -- some implementations will just return the token_id instead of erroring ):
            if (uri.split(':/').length > 1) return true
            return false
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
        tokenGetSymbolAndDecimal: async (contractAddress, tokenStandard) => {
            return await tokenGetSymbolAndDecimal(contractAddress, tokenStandard)
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
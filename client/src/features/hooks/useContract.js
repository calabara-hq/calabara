import React, { useState, useEffect } from 'react'
import Web3 from "web3";
import { erc20abi } from '../wallet/erc20abi';
import { erc721abi } from '../wallet/erc721abi';


const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
let web3Infura = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY))


export default function useContract() {


    async function erc20GetSymbolAndDecimal(contractAddress) {
        const tokenContract = new web3Infura.eth.Contract(erc20abi, contractAddress);
        const symbol = await tokenContract.methods.symbol().call();
        const decimal = await tokenContract.methods.decimals().call();
        return [symbol, decimal]
    }

    async function erc721GetSymbol(contractAddress) {
        const tokenContract = new web3Infura.eth.Contract(erc721abi, contractAddress);
        const symbol = await tokenContract.methods.symbol().call();
        return symbol
    }

    // check balance of token given a wallet address and a contract address
    async function checkERC20Balance(walletAddress, contractAddress, decimal) {
        console.log(walletAddress, contractAddress, decimal)
        const tokenContract = new web3Infura.eth.Contract(erc20abi, contractAddress);
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();
        const adjusted = balance / 10 ** decimal
        console.log(adjusted)
        return adjusted;
    }


    async function checkERC721Balance(walletAddress, contractAddress) {
        const tokenContract = new web3Infura.eth.Contract(erc721abi, contractAddress);
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();
        return balance;
    }

    return {
        erc20GetSymbolAndDecimal: async (contractAddress) => {
            return await erc20GetSymbolAndDecimal(contractAddress)
        },
        erc721GetSymbol,
        checkERC20Balance: async (walletAddress, contractAddress, decimal) => {
            return await checkERC20Balance(walletAddress, contractAddress, decimal)
        },
        checkERC721Balance
    }

}
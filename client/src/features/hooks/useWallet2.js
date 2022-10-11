import { useEffect, useState } from 'react'
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import { showNotification } from '../notifications/notifications'
import useAuthentication from './useAuthentication'


const provider = new ethers.providers.AlchemyProvider('homestead', process.env.REACT_APP_ALCHEMY_KEY)



const checkCurrentJwt = () => {
    const token = localStorage.getItem('jwt');
    try {
        const { exp } = jwt_decode(token);
        if (Date.now() >= exp * 1000) {
            return false;
        }
    } catch (err) {
        return false;
    }
    return true;
}



const validAddress = async (address) => {
    // if it's an ens, convert it
    if (address.endsWith('.eth')) address = await provider.resolveName(address)

    try {
        // get the checksum
        let valid = ethers.utils.getAddress(address)
        return valid
    } catch (err) { return false }
}

const walletDisconnect = async () => {

}

const walletSignMessage = async () => {

}



export default function useWallet2() {
    const { address, isConnected, connector: activeConnector, isDisconnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { authenticationState, clearAuthenticationState, authorize } = useAuthentication()
    const { disconnect } = useDisconnect({
        onSuccess(data) {
            console.log('SUCCESSFULLY DISCONNECTED');
            clearAuthenticationState()
        }
    });
    const { signMessageAsync } = useSignMessage()
    const { openConnectModal } = useConnectModal();





    return {
        walletAddress: address,
        isConnected: isConnected,
        walletConnect: openConnectModal,
        walletDisconnect: disconnect,
        validAddress: validAddress,
        walletSignMessage: walletSignMessage,
        authenticationState: authenticationState
    }
}
import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import useLocalStorage from "./useLocalStorage";
import jwt_decode from 'jwt-decode'
import { useAccount, useDisconnect, useConnect, useSignMessage } from 'wagmi'
import { showNotification } from "../notifications/notifications";
import axios from "axios";
import { ethers } from "ethers";



export default function useAuthentication() {
    const { address, isConnected, isDisconnected } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect({
        onSuccess(data) {
            console.log('SUCCESSFULLY DISCONNECTED');
            clearAuthenticationState()
        }
    });
    const [authToken, setAuthToken] = useLocalStorage('jwt', null, false)
    const [lastUsedConnector, setLastUsedConnector] = useLocalStorage('wagmi.wallet')
    const [state, setState] = useState('loading')

    useEffect(() => {
        let authState = checkCurrentJwt(authToken);
        if (authState === 'authenticated') autoConnect()
        setState(authState);
    }, [])


    useEffect(() => {
        console.log(state, isConnected)
        if (state === 'unauthenticated' && isConnected) {
            console.log('AUTH CASE')
            handleAuth()
        }

        /*
        if (state === 'authenticated' && !isConnected) {
            autoConnect();
        }
        */

        if (state === 'unauthenticated' && !isConnected) {
            //alert('HERE')
            //disconnect();
        }
    }, [state, isConnected])

    useEffect(() => {
        if (isDisconnected && state === 'authenticated') {
            disconnect()
        }
    }, [isDisconnected])



    useInterval(() => {
        setState(checkCurrentJwt(authToken));
    }, 15000)



    const autoConnect = async () => {


        const sorted = lastUsedConnector
            ? [...connectors].sort((x) =>
                x.id === lastUsedConnector ? -1 : 1
            )
            : connectors

        let connected = false
        let data
        for (const connector of sorted) {
            if (!connector.ready || !connector.isAuthorized) continue
            const isAuthorized = await connector.isAuthorized()
            if (!isAuthorized) continue
            console.log('HERE')
            connect({ connector })
            connected = true
            break
        }
        return data
    }


    const checkCurrentJwt = (value) => {
        try {
            const { exp } = jwt_decode(value);
            if (Date.now() >= exp * 1000) {
                return 'unauthenticated';
            }
        } catch (err) {
            return 'unauthenticated';
        }
        return 'authenticated';
    }


    const clearAuthenticationState = () => {
        setState('unauthenticated');
        setAuthToken(null);
    }

    const authorize = (token) => {
        setAuthToken(token);
        setState(checkCurrentJwt(token))
    }


    const handleAuth = async () => {
        const nonce_from_server = await axios.post('/authentication/generate_nonce', { address: address })
        signMessage(nonce_from_server.data.nonce)
            .then(signatureResult => {
                axios.post('/authentication/generate_jwt', { sig: signatureResult.sig, address: address })
                    .then(jwt_result => {
                        showNotification('success', 'success', 'welcome back!')
                        authorize(jwt_result.data.jwt)
                    })

            })
            .catch(error => console.log(error))
    }


    const signMessage = (nonce) => {
        const message = ethers.utils.toUtf8Bytes(`Signing one time message with nonce: ${nonce}`)
        return signMessageAsync({ message })
            .then(signature => {
                return { status: 'success', sig: signature, message: message }
            })
            .catch(error => {
                disconnect();
                showNotification('error', 'error', 'user rejected signature request')
                throw error
            })
    }




    return {
        authenticationState: state,
        clearAuthenticationState: clearAuthenticationState,
        authorize: authorize
    }
}
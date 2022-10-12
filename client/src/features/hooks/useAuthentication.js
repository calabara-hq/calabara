import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import useLocalStorage from "./useLocalStorage";
import jwt_decode from 'jwt-decode'
import { useAccount, useDisconnect, useConnect, useSignMessage } from 'wagmi'
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { showNotification } from "../notifications/notifications";
import axios from "axios";
import { ethers } from "ethers";
import registerUser from "../user/user";

export default function useAuthentication() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage()
    const [authToken, setAuthToken] = useLocalStorage('jwt', null, false)
    const { openConnectModal } = useConnectModal()
    const [state, setState] = useState('loading')

    const { disconnect } = useDisconnect({
        onSuccess() {
            clearAuthenticationState()
        }
    });

    /*
    autoconnect false

    useEffect(() => {
        let authState = checkCurrentJwt(authToken);
        if (authState === 'authenticated') autoConnect()
        setState(authState);
    }, [])


    useEffect(() => {
        if (state === 'unauthenticated' && isConnected) {
            secure_sign()
                .then(sig_res => {
                    if (sig_res) {
                        authorize(sig_res)
                        registerUser(address) // TURTLES remove this when we refactor the other apps
                    }
                })
        }

        if (state === 'authenticated' && !isConnected) {
            disconnect()
        }

    }, [state, isConnected])

*/


    useEffect(() => {
        let authState = checkCurrentJwt(authToken);
        setState(authState);
    }, [])


    useEffect(() => {

        if (state === 'unauthenticated' && isConnected) {
            secure_sign()
                .then(sig_res => {
                    if (sig_res) {
                        authorize(sig_res)
                        registerUser(address) // TURTLES remove this when we refactor the other apps
                    }
                })
        }


        if (state === 'authenticated' && !isConnected) {
            disconnect()
        }

    }, [state, isConnected])



    useInterval(() => {
        let prev_state = state
        let auth_state = checkCurrentJwt(authToken)
        if (prev_state === 'authenticated' && auth_state === 'unauthenticated') return disconnect()

        setState(checkCurrentJwt(authToken));

    }, 15000)



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



    // helpers

    const clearAuthenticationState = () => {
        setState('unauthenticated');
        setAuthToken(null);
    }

    const authorize = (token) => {
        setAuthToken(token);
        setState(checkCurrentJwt(token))
    }

    const secure_sign = async () => {
        const nonce_from_server = await axios.post('/authentication/generate_nonce', { address: address })
        return signMessage(nonce_from_server.data.nonce)
            .then(signatureResult => {
                return axios.post('/authentication/generate_jwt', { sig: signatureResult.sig, address: address })
                    .then(jwt_result => {
                        if (state === 'unauthenticated') showNotification('success', 'success', 'welcome back!')
                        return jwt_result.data.jwt
                    })
            })
            .catch(error => { return null })
    }


    const signMessage = (nonce) => {
        const message = ethers.utils.toUtf8Bytes(`Signing one time message with nonce: ${nonce}`)
        return signMessageAsync({ message })
            .then(signature => {
                return { status: 'success', sig: signature, message: message }
            })
            .catch(error => {
                disconnect();
                if (error.code === 4001) {
                    showNotification('error', 'error', 'User denied signature request')
                }
                else showNotification('error', 'error', 'user rejected signature request')
                throw error
            })
    }



    const authenticated_post = async (endpoint, body) => {
        // just stop them here if they aren't authenticated
        if (state !== 'authenticated') {
            showNotification('hint', 'hint', 'please connect your wallet')
            openConnectModal()
            return null
        }

        return axios.post(endpoint, body, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then(res => { return res })
            .catch(err => {
                switch (err.response.status) {
                    case 401:
                        showNotification('hint', 'hint', 'please connect your wallet')
                        if (state !== 'authenticated') openConnectModal()
                        break;
                    case 403:
                        showNotification('error', 'error', 'this wallet is not an organization admin')
                        break;
                    case 419:
                        showNotification('error', 'error', 'this wallet does not meet submission requirements')
                    case 420:
                        showNotification('error', 'error', 'you have already made a submission for this contest')
                        break;
                    case 432:
                        showNotification('error', 'error', 'this contest is not accepting submissions at this time')
                        break;
                    case 433:
                        showNotification('error', 'error', 'this contest is not accepting votes at this time')
                        break;
                    case 434:
                        showNotification('error', 'error', 'this wallet does not meet voting requirements')
                        break;
                    case 435:
                        showNotification('error', 'error', 'you cannot vote on your own submission')
                        break
                    case 436:
                        showNotification('error', 'error', 'amount exceeds available voting power')
                        break
                    case 437:
                        showNotification('error', 'error', 'only select addresses are able to create contests at this time')
                        break
                    case 438:
                        showNotification('error', 'error', 'the contest is not over yet!')
                        break
                }
                return null
            })

    }



    return {
        disconnect: () => { disconnect() },
        secure_sign: () => { return secure_sign() },
        authenticated_post: async (endpoint, body) => { return await authenticated_post(endpoint, body) }
    }
}
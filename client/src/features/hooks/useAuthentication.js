import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import { useAccount, useDisconnect, useConnect, useSignMessage } from 'wagmi'
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { showNotification } from "../notifications/notifications";
import axios from "axios";
import { ethers } from "ethers";
import registerUser from "../user/user";

import { useDispatch, useSelector } from "react-redux";
import { clearSession, selectUserSession, selectWalletAddress, setUserSession } from "../../app/sessionReducer";


export default function useAuthentication() {
    const { signMessageAsync } = useSignMessage()
    const [sessionExpiresAt, setSessionExpiresAt] = useState(null)
    const { openConnectModal } = useConnectModal()
    const [state, setState] = useState('loading')
    const connectedAddress = useSelector(selectWalletAddress)
    const dispatch = useDispatch();
    const session = useSelector(selectUserSession)
    const { disconnect } = useDisconnect();

    const { address } = useAccount({
        onDisconnect() {
            clearAuthenticationState();
        },

        onConnect({ address }) {
            if (!session && address) {
                handleAuth(address)
            }
        }
    })

    useEffect(() => {
        if (connectedAddress && (connectedAddress !== address)) {
            disconnect();
        }
    }, [address])


    useEffect(() => {
        if (!session) return disconnect()
    }, [session])


    const handleAuth = (address) => {
        secure_sign(address)
            .then(sig_res => {
                if (sig_res) {
                    dispatch(setUserSession(sig_res))
                }
            })
    }


    const clearAuthenticationState = () => {
        fetch('/authentication/signOut', { credentials: 'include' })
            .then(dispatch(clearSession()))
    }



    const secure_sign = async (address) => {
        const nonce_from_server = await axios.post('/authentication/generate_nonce', { address: address })
        return signMessage(nonce_from_server.data.nonce)
            .then(signatureResult => {
                return axios.post('/authentication/generate_session', { sig: signatureResult.sig, address: address }, { withCredentials: true })
                    .then((res) => {
                        if (!session) showNotification('success', 'success', 'welcome back!')
                        return res.data.user
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
        if (!session) {
            alert('here!')
            showNotification('hint', 'hint', 'please connect your wallet')
            openConnectModal()
            return null
        }

        return axios.post(endpoint, body, { withCredentials: true })
            .then(res => { return res })
            .catch(err => {
                switch (err.response.status) {
                    case 401:
                        showNotification('hint', 'hint', 'please connect your wallet')
                        if (!session) openConnectModal()
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
                    case 439:
                        showNotification('error', 'error', 'not a twitter contest')
                        break
                    case 440:
                        showNotification('error', 'error', 'twitter account not authorized')
                        break
                    case 441:
                        showNotification('error', 'error', 'duplicate of tweet content')
                        break
                    case 442:
                        showNotification('error', 'error', 'problem sending the tweet')
                        break
                    case 443:
                        showNotification('error', 'error', 'malformed tweet')
                        break
                    case 444:
                        showNotification('error', 'error', 'twitter is down. please try again later')
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
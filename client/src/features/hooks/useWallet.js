import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import registerUser from '../user/user';
import { useInterval } from '../hooks/useInterval';
import Web3 from "web3";
import Onboard from 'bnc-onboard'
import { showNotification } from '../notifications/notifications';
import store from '../../app/store.js'
import jwt_decode from 'jwt-decode'
import { setIsTokenExpired } from '../wallet/wallet-reducer';
import axios from 'axios';

import {
    setConnected,
    setDisconnected,
    selectConnectedBool,
    selectConnectedAddress,
    setAccountChange,
    selectAccountChange,
    manageAccountChange,
    selectIsTokenExpired,
} from '../wallet/wallet-reducer';



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

const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_KEY;
const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;


let web3
let web3Infura = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY))

const wallets = [
    { walletName: "metamask", preferred: true },
]


const onboard = Onboard({
    dappId: BLOCKNATIVE_KEY,
    networkId: 1,
    darkMode: true,
    walletSelect: { wallets: wallets },
    subscriptions: {
        wallet: wallet => {
            // instantiate web3 when the user has selected a wallet
            web3 = new Web3(wallet.provider);
            localStorage.setItem('selectedWallet', wallet.name);
        },

        network: network => {
            if (network && network != 1) {
                showNotification("different network", 'hint', 'please switch your network to ETH mainnet')
            }
        },

        address: address => {
            store.dispatch(manageAccountChange(address))
        }

    }
})


export default function useWallet() {
    const isConnected = useSelector(selectConnectedBool);
    const walletAddress = useSelector(selectConnectedAddress);
    const account_change = useSelector(selectAccountChange);
    const is_token_expired = useSelector(selectIsTokenExpired)
    const dispatch = useDispatch();
    const [connectBtnTxt, setConnectBtnTxt] = useState('Connect wallet');
    const [isMoreExpanded, setIsMoreExpanded] = useState(false);

    useInterval(async () => {

        let jwt_valid = checkCurrentJwt();
        if (!jwt_valid) handleDisconnectClick();
    }, 15000)

    useEffect(() => {
        (async () => {
            const selected = localStorage.getItem('selectedWallet');
            if (selected != '' && selected != undefined && selected != 'undefined') {
                const res = await onboard.walletSelect(selected);
                if (res) {
                    await onboard.walletCheck();
                    const state = onboard.getState();
                    const checkSumAddr = web3Infura.utils.toChecksumAddress(state.address)
                    let is_jwt_valid = checkCurrentJwt()

                    // we'll auto connect if possible. otherwise just wait for connect click

                    if (is_jwt_valid) {
                        dispatch(setConnected(checkSumAddr))
                        await registerUser(checkSumAddr)
                    }

                }
            }
        })();
    }, [])


    useEffect(() => {
        if (isConnected) {
            setConnectBtnTxt(walletAddress.substring(0, 6) + '...' + walletAddress.substring(38, 42))
        }
    }, [isConnected])

    // manage user switches wallet accounts

    useEffect(() => {
        (async () => {
            if (account_change === true && !isConnected) {
                setConnectBtnTxt('Connect wallet')
                setIsMoreExpanded(false);
                localStorage.removeItem('jwt')
                dispatch(setAccountChange(false))
            }
        })();
    }, [account_change])

    // manage user token expiration

    useEffect(() => {
        if (is_token_expired) {
            dispatch(setDisconnected());
            setConnectBtnTxt('Connect wallet')
            localStorage.removeItem('jwt')
        }
    }, [is_token_expired])


    async function validAddress(address) {
        // if it's ens, convert it
        if (address.endsWith('.eth')) {
            address = await web3Infura.eth.ens.getAddress(address)
        }
        try {
            var valid = web3Infura.utils.toChecksumAddress(address)
            return valid
        } catch (e) {
            if (e) return false
        }
    }



    async function signMessage(nonce) {
        let state = onboard.getState();

        let address = await validAddress(state.address);
        const msg = web3.utils.utf8ToHex(`Signing one time message with nonce: ${nonce}`)

        try {
            let signature = await web3.eth.personal.sign(msg, address);

            return { status: 'success', sig: signature, msg: msg }
        } catch (err) {
            throw err
        }
    }

    const handleConnectClick = async () => {

        if (isConnected) return setIsMoreExpanded(!isMoreExpanded)


        const selected = localStorage.getItem('selectedWallet');
        let res;
        if (selected && selected != 'undefined') {
            res = await onboard.walletSelect(selected);
        }
        else {
            res = await onboard.walletSelect();
        }
        if (res) {
            await onboard.walletCheck();
            const state = onboard.getState();
            const checkSumAddr = web3Infura.utils.toChecksumAddress(state.address)

            let is_jwt_valid = checkCurrentJwt()

            // we'll auto connect if possible.

            if (is_jwt_valid) {
                dispatch(setConnected(checkSumAddr))
                await registerUser(checkSumAddr)
            }
            // otherwise, start the auth flow and get a new token

            else {
                let sig_res = await secure_sign(checkSumAddr, dispatch)
                if (sig_res) {
                    dispatch(setConnected(checkSumAddr))
                    await registerUser(checkSumAddr)
                }
            }
        }

    }


    const handleDisconnectClick = async () => {

        if (isConnected) {
            onboard.walletReset();
            dispatch(setDisconnected());
            setConnectBtnTxt('Connect wallet')
            setIsMoreExpanded(false);
            localStorage.removeItem('jwt')
        }

    }


    const secure_sign = async (walletAddress) => {

        const nonce_from_server = await axios.post('/authentication/generate_nonce', { address: walletAddress })
        try {
            const signatureResult = await signMessage(nonce_from_server.data.nonce);

            try {
                console.log(walletAddress)
                let jwt_result = await axios.post('/authentication/generate_jwt', { sig: signatureResult.sig, address: walletAddress })
                dispatch(setIsTokenExpired(false))
                localStorage.setItem('jwt', jwt_result.data.jwt)
                return jwt_result.data.jwt
            } catch (e) {
                return null
            }
        } catch (err) {
            if (err.code === 4001) {
                showNotification('error', 'error', 'User denied signature request')
            }
            else {
                showNotification('error', 'error', 'Metamask error')
            }
            return null;
        }

    }

    return {

        walletDisconnect: () => {
            handleDisconnectClick()
        },
        walletConnect: () => {
            handleConnectClick()
        },
        walletSignMessage: async (walletAddress) => {
            return await secure_sign(walletAddress)
        },
        walletAddress,
        isConnected,
        connectBtnTxt,
    }

}
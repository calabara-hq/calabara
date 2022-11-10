import { createAuthenticationAdapter, darkTheme, getDefaultWallets, RainbowKitAuthenticationProvider, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import axios from 'axios';
import merge from 'lodash.merge';
import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SiweMessage } from 'siwe';
import { chain, configureChains, createClient, useAccount, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import useWallet from '../features/hooks/useWallet.js';
import { showNotification } from '../features/notifications/notifications.js';
import { clearSession, selectIsAuthenticated, setUserSession } from './sessionReducer.js';

const { chains, provider } = configureChains(
    [chain.mainnet],
    [
        infuraProvider({ apiKey: process.env.INFURA_KEY }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'calabara',
    chains
});



const myTheme = merge(darkTheme(), {
    colors: {
        accentColor: '#539bf5',
        accentColorForeground: 'white',
        connectButtonBackground: '#24262a',
        modalBackground: '#24262a'
    },
    blurs: {
        //modalOverlay: 'blur(4px)'
    },
    fonts: {
        body: 'Ubuntu'
    },
    radii: {
        actionButton: '10px',
        connectButton: '8px',
        menuButton: '8px',
        modal: '16px',
        modalMobile: '18px',
    }

});


export const WalletProvider = ({ children, initial_session }) => {


    const wagmiClient = React.useMemo(() =>
        createClient({
            autoConnect: initial_session ? true : false,
            connectors,
            provider,
        }), [])

    return (
        <WagmiConfig client={wagmiClient}>
            <AuthenticationProvider>
                <RainbowKitProvider modalSize='compact' chains={chains} theme={myTheme}>
                    <WalletHookMethods>
                        {children}
                    </WalletHookMethods>
                </RainbowKitProvider>
            </AuthenticationProvider>
        </WagmiConfig >
    );
}

const AuthenticationProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const dispatch = useDispatch()
    const authenticationAdapter = React.useMemo(() =>
        createAuthenticationAdapter({

            getNonce: async () => {
                const nonce_from_server = await axios.post('/authentication/generate_nonce', { address: address })
                return nonce_from_server.data.nonce
            },

            createMessage: ({ nonce, address, chainId }) => {
                return new SiweMessage({
                    domain: window.location.host,
                    address,
                    statement: 'Sign in with Ethereum to the app.',
                    uri: window.location.origin,
                    version: '1',
                    chainId,
                    nonce,
                });
            },

            getMessageBody: ({ message }) => {
                return message.prepareMessage();
            },

            verify: async ({ message, signature }) => {
                await axios.post('/authentication/generate_session', { message: message, signature: signature }, { withCredentials: true })
                    .then(res => {
                        dispatch(setUserSession(res.data.user))
                        showNotification('success', 'success', 'welcome back!')
                    })
                    .catch(err => { throw new Error() })
            },

            signOut: async () => {
                fetch('/authentication/signOut', { credentials: 'include' })
                    .then(dispatch(clearSession()))
            },
        }), [])


    return (
        <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={isAuthenticated}>
            {children}
        </RainbowKitAuthenticationProvider>
    )
}

const WalletContext = createContext({});

const WalletHookMethods = ({ children }) => {

    const { walletDisconnect, walletConnect, walletAddress, validAddress, isConnected, authenticated_post } = useWallet();

    let walletProviderValues = {
        walletDisconnect,
        walletConnect,
        validAddress,
        authenticated_post
    }


    return (
        <WalletContext.Provider value={walletProviderValues}>
            {children}
        </WalletContext.Provider>

    )
}

export const useWalletContext = () => useContext(WalletContext)
import React, { useContext, createContext, useMemo, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import useWallet from '../features/hooks/useWallet.js';
import merge from 'lodash.merge'
import jwt_decode from 'jwt-decode'
import useAuthentication from '../features/hooks/useAuthentication.js';

const { chains, provider } = configureChains(
    [chain.mainnet],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'calabara',
    chains
});


const is_jwt_valid = () => {
    try {
        const { exp } = jwt_decode(window.localStorage.getItem('jwt'));
        if (Date.now() >= exp * 1000) {
            return false;
        }
    } catch (err) {
        return false;
    }
    return true;
}

const wagmiClient = createClient({
    autoConnect: is_jwt_valid(),
    connectors,
    provider,
})


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



export const WalletProvider = ({ children }) => {

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider modalSize='compact' chains={chains} theme={myTheme}>
                <WalletHookMethods>
                    {children}
                </WalletHookMethods>
            </RainbowKitProvider>

        </WagmiConfig >
    );
}

const WalletContext = createContext({});

const WalletHookMethods = ({ children }) => {

    const { walletDisconnect, walletConnect, walletAddress, validAddress, isConnected, authenticated_post } = useWallet();

    let walletProviderValues = {
        walletDisconnect,
        walletConnect,
        walletAddress,
        validAddress,
        isConnected,
        authenticated_post
    }


    return (
        <WalletContext.Provider value={walletProviderValues}>
            {children}
        </WalletContext.Provider>

    )
}

export const useWalletContext = () => useContext(WalletContext)
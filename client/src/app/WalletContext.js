import React, { useContext, createContext, useMemo, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import useWallet from '../features/hooks/useWallet.js';
import merge from 'lodash.merge'

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
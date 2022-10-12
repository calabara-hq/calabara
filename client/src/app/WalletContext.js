import React, { useContext, createContext, useMemo } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import useWallet2 from '../features/hooks/useWallet2.js';
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

const wagmiClient = createClient({
    autoConnect: false,
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
        modalOverlay: 'blur(4px)'
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

    const { walletDisconnect, walletConnect, walletAddress, validAddress, isConnected, authenticationState } = useWallet2();

    let walletProviderValues = {
        walletDisconnect,
        walletConnect,
        walletAddress,
        validAddress,
        isConnected,
        authenticationState
    }


    return (
        <WalletContext.Provider value={walletProviderValues}>
            {children}
        </WalletContext.Provider>

    )
}

export const useWalletContext = () => useContext(WalletContext)
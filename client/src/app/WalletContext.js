import React, { useContext, createContext, useMemo } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultWallets,
    RainbowKitProvider,
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    darkTheme
} from '@rainbow-me/rainbowkit';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import useWallet2 from '../features/hooks/useWallet2.js';


export const { chains, provider } = configureChains(
    [chain.mainnet],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider()
    ]
);

export const { connectors } = getDefaultWallets({
    appName: 'calabara',
    chains
});

export const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
})



export const WalletProvider = ({ children }) => {
    console.log('RE RENDER WALLET PROVIDER')

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={darkTheme()} >
                <WalletHookMethods>
                    {children}
                </WalletHookMethods>
            </RainbowKitProvider>

        </WagmiConfig >
    );
}

export const WalletContext = createContext({});

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
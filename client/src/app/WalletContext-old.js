import React, { useContext, useState, createContext } from 'react';
import useWallet from '../features/hooks/useWallet';


export const WalletContext = createContext({});

export const WalletProvider = ({ children }) => {

    const { walletDisconnect, walletConnect, walletAddress, validAddress, isConnected, connectBtnTxt, isMoreExpanded, setIsMoreExpanded } = useWallet();

    let walletProviderValues = {
        walletDisconnect,
        walletConnect,
        walletAddress,
        validAddress,
        isConnected,
        connectBtnTxt,
        isMoreExpanded,
        setIsMoreExpanded
    }

    return (
        <WalletContext.Provider value={walletProviderValues}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => useContext(WalletContext);


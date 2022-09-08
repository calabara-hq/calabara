import React, { useContext, useState, createContext } from 'react';
import useWallet from '../features/hooks/useWallet';


const WalletContext = createContext({});

const WalletProvider = ({ children }) => {

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

const useWalletContext = () => useContext(WalletContext);

export { WalletProvider, useWalletContext };
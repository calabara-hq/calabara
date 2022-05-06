import React, { useState, useEffect } from 'react'
import Web3 from "web3";
import Onboard from 'bnc-onboard'
import { showNotification } from '../notifications/notifications';
import Identicon from '../identicon/identicon';
import store from '../../app/store.js'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { secure_sign } from '../common/common';
import { erc20abi } from './erc20abi';
import { erc721abi } from './erc721abi';

import { useSelector, useDispatch } from 'react-redux';
import {
  setConnected,
  setDisconnected,
  selectConnectedBool,
  selectConnectedAddress,
  setAccountChange,
  selectAccountChange,
  manageAccountChange,
  selectIsTokenExpired,
} from './wallet-reducer';

import registerUser from '../user/user';
import { useInterval } from '../../hooks/useInterval';
import { windowEndpoint } from 'comlink';



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


// fetch wallet address
async function getAddress() {
  try {
    var walletAddress = await web3.eth.getAccounts();
    return (walletAddress[0])
  } catch (e) {
    return 'not connected'
  }
}

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





async function erc20GetSymbolAndDecimal(address) {
  const tokenContract = new web3Infura.eth.Contract(erc20abi, address);
  const symbol = await tokenContract.methods.symbol().call();
  const decimal = await tokenContract.methods.decimals().call();
  return [symbol, decimal]
}

async function erc721GetSymbol(address) {
  const tokenContract = new web3Infura.eth.Contract(erc721abi, address);
  const symbol = await tokenContract.methods.symbol().call();
  return symbol
}

// check balance of token given a wallet address and a contract address
async function checkERC20Balance(walletAddress, contractAddress, decimal) {
  const tokenContract = new web3Infura.eth.Contract(erc20abi, contractAddress);
  const balance = await tokenContract.methods.balanceOf(walletAddress).call();
  const adjusted = balance / 10 ** decimal
  return adjusted;

}


async function checkERC721Balance(walletAddress, contractAddress) {
  const tokenContract = new web3Infura.eth.Contract(erc721abi, contractAddress);
  const balance = await tokenContract.methods.balanceOf(walletAddress).call();
  return balance;

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


const auxillaryConnect = async () => {
  const res = await onboard.walletSelect();
  if (!res) {
    return null;
  }
  else {
    await onboard.walletCheck();
    const state = onboard.getState();
    const checkSumAddr = web3Infura.utils.toChecksumAddress(state.address)
    store.dispatch(setConnected(checkSumAddr))
    return checkSumAddr
  }
}


function Wallet() {
  const isConnected = useSelector(selectConnectedBool);
  const walletAddress = useSelector(selectConnectedAddress);
  const account_change = useSelector(selectAccountChange);
  const is_token_expired = useSelector(selectIsTokenExpired)
  const dispatch = useDispatch();
  const [connectBtnTxt, setConnectBtnTxt] = useState('Connect wallet');
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)

  const open = () => { setModalOpen(true) }
  const close = () => { setModalOpen(false) }





  // pull current jwt from local storage and check it's expiration

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


  useInterval(async () => {
    
    let jwt_valid = checkCurrentJwt();
    if (!jwt_valid) handleDisconnectClick();
  }, 15000)


  useEffect(async () => {
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
      
      let is_jwt_valid = await checkCurrentJwt()

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


  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsMoreExpanded(false)
    }
  }


  return (
    <div tabIndex="0" onBlur={handleBlur} onClick={handleConnectClick} className="walletBox">
      <div>
        {isConnected &&
          <div className="walletAvatar">
            <Identicon address={walletAddress} />
          </div>
        }
        <p className="addressText">{connectBtnTxt}</p>

      </div>
      {isMoreExpanded &&
        <div className="connectionInfo">
          <span onClick={() => { window.open('https://etherscan.io/address/' + walletAddress) }}>{connectBtnTxt}</span>
          <button onClick={handleDisconnectClick}>disconnect</button>
        </div>
      }
    </div>
  )

}

export default Wallet;
export { auxillaryConnect, getAddress, validAddress, erc20GetSymbolAndDecimal, erc721GetSymbol, signMessage, checkERC20Balance, checkERC721Balance }

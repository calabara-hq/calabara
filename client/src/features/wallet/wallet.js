import React, { useState, useEffect } from 'react'
import Web3 from "web3";
import Onboard from 'bnc-onboard'
import { showNotification } from '../notifications/notifications';
import Identicon from '../identicon/identicon';
import store from '../../app/store.js'

import { useSelector, useDispatch } from 'react-redux';
import {
  setConnected,
  setDisconnected,
  selectConnectedBool,
  selectConnectedAddress,
  setAccountChange,
  selectAccountChange,
  manageAccountChange,
} from './wallet-reducer';

import { registerUser } from '../user/user-reducer';



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


const erc20abi = [

  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },

  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }]

const erc721abi = [
  {
    'inputs': [{ 'internalType': 'address', 'name': 'owner', 'type': 'address' }],
    'name': 'balanceOf',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'payable': false, 'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
    'inputs': [],
    'name': 'name',
    'outputs': [{ 'internalType': 'string', 'name': '', 'type': 'string' }],
    'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
    'inputs': [{ 'internalType': 'uint256', 'name': 'tokenId', 'type': 'uint256' }],
    'name': 'ownerOf',
    'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
    'payable': false, 'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
    'inputs': [],
    'name': 'symbol',
    'outputs': [{ 'internalType': 'string', 'name': '', 'type': 'string' }],
    'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'stateMutability': 'view', 'type': 'function', 'constant': true
  },
]


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


async function signTransaction(message, whitelist) {
  const data = message;

  let state = onboard.getState();

  // if web3.currentProvider == null, ask user to sign in.


  /* error codes --> 

    0 --> user canceled transaction
    1 --> metamask error
    2 --> invalid permissions
    3 --> success
    4 --> not connected

  */



  const transact = async () => {
    let address = await validAddress(state.address);
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: JSON.stringify(data)
      },
    ]

    var params = [msgParams, address]
    var method = 'eth_signTypedData'
    return web3.currentProvider.send({ method, params, address }, async function (err, result) {
      if (err) {
        return 0;
      }
      if (result.error) {
        return 1;
      }
      else {
        for (var i in whitelist) {
          if (whitelist[i].endsWith('.eth')) {
            whitelist[i] = await web3.eth.ens.getAddress(whitelist[i])
          }
          if (whitelist[i] == address) {
            return 3;
          }
        }
        // user doesn't have permission to sign this transaction
        return 2;
      }
    })
  }

  if (!state.address) {
    const res = await onboard.walletSelect();
    if (!res) {
      return 4;
    }
    else {
      await onboard.walletCheck();
      state = onboard.getState();
      store.dispatch(setConnected(state.address))
      return transact();
    }

  }
  else {
    return transact();
  }
}

const auxillaryConnect = async () => {
  const res = await onboard.walletSelect();
  if (!res) {
    return;
  }
  else {
    await onboard.walletCheck();
    const state = onboard.getState();
    store.dispatch(setConnected(state.address))
  }
}


function Wallet() {
  const isConnected = useSelector(selectConnectedBool);
  const walletAddress = useSelector(selectConnectedAddress);
  const account_change = useSelector(selectAccountChange);
  const dispatch = useDispatch();
  const [connectBtnTxt, setConnectBtnTxt] = useState('Connect wallet');
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);



  // if a user has previously connected, this function will auto re-connect them without having to open the modal.
  // if localstorage doesn't remember them or they disconnected, don't force autoconnect. wait for connect button click
  // this should be called on page load.


  const connectCleanup = () => {
    const state = onboard.getState();
    const checkSumAddr = web3Infura.utils.toChecksumAddress(state.address)
    dispatch(setConnected(checkSumAddr))
    setConnectBtnTxt(state.address.substring(0, 6) + '...' + state.address.substring(38, 42))
  }




  useEffect(async () => {
    (async () => {
      const selected = localStorage.getItem('selectedWallet');
      if (selected != '' && selected != undefined && selected != 'undefined') {
        await onboard.walletSelect(selected);
        await onboard.walletCheck();
        const state = onboard.getState();
        const checkSumAddr = web3Infura.utils.toChecksumAddress(state.address)
        dispatch(setConnected(checkSumAddr))
        dispatch(registerUser(checkSumAddr))
      }
    })();
  }, [])


  useEffect(() => {
    if (isConnected) {
      setConnectBtnTxt(walletAddress.substring(0, 6) + '...' + walletAddress.substring(38, 42))
    }
  }, [isConnected])



  useEffect(async () => {
    console.log(account_change)
    console.log(isConnected)
    if (account_change === true && !isConnected) {
      const state = onboard.getState();
      const checkSumAddr = web3Infura.utils.toChecksumAddress(state.address)
      console.log(checkSumAddr)
      dispatch(setConnected(checkSumAddr))
      dispatch(registerUser(checkSumAddr))
      dispatch(setAccountChange(false))

    }
  }, [account_change])

  const handleConnectClick = async () => {
    if (!isConnected) {
      const res = await onboard.walletSelect();
      if (res) {
        await onboard.walletCheck();
        const state = onboard.getState();
        const checkSumAddr = web3Infura.utils.toChecksumAddress(state.address)
        dispatch(setConnected(checkSumAddr))
        dispatch(registerUser(checkSumAddr))
      }
    }
    else if (isConnected) {
      setIsMoreExpanded(!isMoreExpanded)
    }
  }


  const handleDisconnectClick = async (e) => {
    if (isConnected) {
      onboard.walletReset();
      dispatch(setDisconnected());
      setConnectBtnTxt('Connect wallet')
      setIsMoreExpanded(false);
    }
  }


  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsMoreExpanded(false)
    }
  }


  return (
    <div tabIndex="0" onBlur={handleBlur} onClick={handleConnectClick} className="walletBox">
      <div>
        <p>{connectBtnTxt}</p>
        {isConnected &&
          <div className="walletAvatar">
            <Identicon address={walletAddress} />
          </div>
        }
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
export { auxillaryConnect, getAddress, validAddress, erc20GetSymbolAndDecimal, erc721GetSymbol, signTransaction, checkERC20Balance, checkERC721Balance }

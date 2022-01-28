import React, { useState, useEffect } from 'react'
import Web3 from "web3";
import Onboard from 'bnc-onboard'
import { showNotification } from '../notifications/notifications';
import { useParams, useHistory } from 'react-router-dom'
import Identicon from '../identicon/identicon';


import { useSelector, useDispatch } from 'react-redux';
import {
  setConnected,
  setDisconnected,
  selectConnectedBool,
  selectConnectedAddress,
} from './wallet-reducer';




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
  walletSelect: {wallets: wallets},
  subscriptions: {
    wallet: wallet => {
      // instantiate web3 when the user has selected a wallet
      web3 = new Web3(wallet.provider);
      localStorage.setItem('selectedWallet', wallet.name);
    },

    network: network => {
      console.log(network)
      if(network && network != 1){
        showNotification("different network", 'hint', 'please switch your network to ETH mainnet')
      }
    },
    
  }
})


// fetch wallet address
async function getAddress(){
  var walletAddress = await web3.eth.getAccounts();
  return(walletAddress[0])
}

async function validAddress(address){
  // if it's ens, convert it
  if(address.endsWith('.eth')){
    address = await web3Infura.eth.ens.getAddress(address)
  }
  try{
    var valid = web3Infura.utils.toChecksumAddress(address)
    return valid
  }catch(e){
    if(e) return false
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
      'inputs': [{'internalType': 'address', 'name': 'owner', 'type': 'address'}],
      'name': 'balanceOf',
      'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
      'payable': false, 'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
      'inputs': [],
      'name': 'name',
      'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}],
      'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
      'inputs': [{'internalType': 'uint256', 'name': 'tokenId', 'type': 'uint256'}],
      'name': 'ownerOf',
      'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
      'payable': false, 'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
      'inputs': [],
      'name': 'symbol',
      'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}],
      'stateMutability': 'view', 'type': 'function', 'constant': true
  },
  {
      'inputs': [],
      'name': 'totalSupply',
      'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
      'stateMutability': 'view', 'type': 'function', 'constant': true
  },
]


async function erc20GetSymbolAndDecimal(address){
  const tokenContract = new web3Infura.eth.Contract(erc20abi, address);
  const symbol = await tokenContract.methods.symbol().call();
  const decimal = await tokenContract.methods.decimals().call();
  return[symbol, decimal]
}

async function erc721GetSymbol(address){
  const tokenContract = new web3Infura.eth.Contract(erc721abi, address);
  const symbol = await tokenContract.methods.symbol().call();
  return symbol
}

// check balance of token given a wallet address and a contract address
async function checkERC20Balance(walletAddress, contractAddress, decimal){
  const tokenContract = await new web3Infura.eth.Contract(erc20abi, contractAddress);
  const balance = await tokenContract.methods.balanceOf(walletAddress).call();
  const adjusted = balance / 10** decimal
  return adjusted;

}


async function checkERC721Balance(walletAddress, contractAddress){
  const tokenContract = await new web3Infura.eth.Contract(erc721abi, contractAddress);
  const balance = await tokenContract.methods.balanceOf(walletAddress).call();
  return balance;

}


async function signTransaction(address, message, whitelist){
  const data = message;
  console.log(whitelist);

  // if web3.currentProvider == null, ask user to sign in.


  /* error codes --> 

    0 --> user canceled transaction
    1 --> metamask error
    2 --> invalid permissions
    3 --> success

  */
  const msgParams = [
                {
                    type: 'string',
                    name: 'Message',
                    value: JSON.stringify(data)
                },
            ]

  var from = address;
  var params = [msgParams, from]
  var method = 'eth_signTypedData'




  //await connectWallet();


  return web3.currentProvider.send({method, params, from}, async function(err, result) {
    if(err) {
      return 0;
    }
    if(result.error){
      return 1;
    }
    else{

      for(var i in whitelist){
        if(whitelist[i].endsWith('.eth')){
          whitelist[i] = await web3.eth.ens.getAddress(whitelist[i])
        }
        if(whitelist[i] == address){
          return 3;
        }
      }
    // user doesn't have permission to sign this transaction
    return 2;
    }
  })
 
}


function Wallet(){
  const isConnected = useSelector(selectConnectedBool);
  const walletAddress = useSelector(selectConnectedAddress);
  const address = useSelector(selectConnectedAddress);
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
    setConnectBtnTxt(state.address.substring(0,6) + '...' + state.address.substring(38, 42))
  }




  useEffect(async()=>{
    (async () => {
      const selected = localStorage.getItem('selectedWallet');
      if(selected != '' && selected != undefined && selected != 'undefined'){
        console.log('here')
        await onboard.walletSelect(selected);
        await onboard.walletCheck();
        connectCleanup();
      }
    })();
  },[])



        //setConnectBtnTxt(walletAddress.substring(0,7) + '...' + walletAddress.substring(37, 42))

  const handleConnectClick = async() => {
    if(!isConnected){
      const res = await onboard.walletSelect();
      if(res){
        await onboard.walletCheck();
        connectCleanup();
      }
    }
    else if(isConnected){
      setIsMoreExpanded(!isMoreExpanded)
    }
  }


  const handleDisconnectClick = async() => {
    if(isConnected){
      await onboard.walletReset();
      dispatch(setDisconnected());
      setConnectBtnTxt('Connect wallet')
      setIsMoreExpanded(false)
    }
  }





  
return(
 <div className="walletBox">
   <div>
    <div className="walletAvatar">
      {isConnected && <Identicon address={walletAddress}/>}
    </div>

    <div className="walletConnectBtn"  onClick={handleConnectClick}>{connectBtnTxt}
    
    </div>

  </div>
  {isMoreExpanded && 
  <div className="connectionInfo">
    <Identicon address={walletAddress}/>
    <div className="connectionInfoAddress">
    <span onClick={() => {window.open('https://etherscan.io/address/' + walletAddress)}}>{connectBtnTxt}</span>
    <button onClick={handleDisconnectClick}>Disconnect</button>
    </div>
  </div>
  }
  
 </div>
)

}

export default Wallet;
export { getAddress, validAddress, erc20GetSymbolAndDecimal, erc721GetSymbol, signTransaction, checkERC20Balance, checkERC721Balance}

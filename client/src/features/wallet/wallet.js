import React from 'react'
import Identicon from '../identicon/identicon';
import useWallet from '../hooks/useWallet';




export default function Wallet() {
  const {walletDisconnect, walletConnect, walletAddress, isConnected, connectBtnTxt, isMoreExpanded, setIsMoreExpanded} = useWallet();

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsMoreExpanded(false)
    }
  }


  return (
    <div tabIndex="0" onBlur={handleBlur} onClick={walletConnect} className="walletBox">
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
          <button onClick={walletDisconnect}>disconnect</button>
        </div>
      }
    </div>
  )

}


import { ConnectButton } from '@rainbow-me/rainbowkit';



export default function Wallet() {
  return (
    <div className="walletBox">
      <ConnectButton showBalance={false}/>
    </div>
  )
};

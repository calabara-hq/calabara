import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Wallet() {

  return (
    <div className="walletBox">
      <ConnectButton accountStatus={{
        smallScreen: 'address',
        largeScreen: 'full'
      }}
        showBalance={false} />
    </div>
  )
};

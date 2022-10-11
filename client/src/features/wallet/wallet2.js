import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';



export default function Wallet() {
  return (
    <div className="walletBox">
      <ConnectButton showBalance={false} />
    </div>
  )
};

/*
export default function Wallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openConnectModal,
        mounted,
      }) => {

        const ready = mounted;
        const connected =
          mounted &&
          account &&
          chain
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
*/

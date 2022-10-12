import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { useWalletContext } from '../../app/WalletContext';



export default function Wallet() {
  const { authenticated_post } = useWalletContext();

  const authPost = async () => {
    let res = await authenticated_post('/creator_contests/test_auth', { myData: 'hello from button' })
    console.log(res)
  }


  return (
    <div className="walletBox">
      <ConnectButton showBalance={false} />
      <button onClick={authPost}>auth post</button>
    </div>
  )
};

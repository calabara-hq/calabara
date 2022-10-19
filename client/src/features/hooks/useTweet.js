import { useParams } from "react-router-dom"
import { useWalletContext } from "../../app/WalletContext";




export default function useTweet() {
    const { authenticated_post } = useWalletContext();


    const sendQuoteTweet = (ens, contest_hash, tweet) => {
        authenticated_post('/twitter/sendQuoteTweet', { ens: ens, contest_hash: contest_hash, tweet: tweet })
            .then(res => console.log(res))
    }

    return {
        sendQuoteTweet: (ens, contest_hash, tweet) => { return sendQuoteTweet(ens, contest_hash, tweet) }
    }
}
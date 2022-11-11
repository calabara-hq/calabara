import { useParams } from "react-router-dom"
import { useWalletContext } from "../../app/WalletContext";




export default function useTweet() {
    const { authenticated_post } = useWalletContext();

    /**
     * 
     * @param {*} ens 
     * @param {*} contest_hash 
     * @param {*} tweet array of form [{
        * text: 'xyz',
        * media: {
        *  media_id: 123,
        *  preview: blob
        *  }
     * }]
     */

    const sendQuoteTweet = (ens, contest_hash, tweet) => {
        return authenticated_post('/twitter/sendQuoteTweet', { ens: ens, contest_hash: contest_hash, tweet: tweet })
            .then(res => {
                if (!res) throw (new Error())
                return res
            })
    }

    return {
        sendQuoteTweet: (ens, contest_hash, tweet) => { return sendQuoteTweet(ens, contest_hash, tweet) }
    }
}
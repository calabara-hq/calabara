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


    // process thread to strip out previews
    const process_thread = (thread) => {
        return thread.map(el => {
            let { text, media } = el
            let { media_id } = media
            return { text, media: { media_ids: [media_id] } }
        })
    }

    const sendQuoteTweet = (ens, contest_hash, tweet) => {
        let processed_thread = process_thread(tweet)
        authenticated_post('/twitter/sendQuoteTweet', { ens: ens, contest_hash: contest_hash, tweet: processed_thread })
            .then(res => console.log(res))
    }

    return {
        sendQuoteTweet: (ens, contest_hash, tweet) => { return sendQuoteTweet(ens, contest_hash, tweet) }
    }
}
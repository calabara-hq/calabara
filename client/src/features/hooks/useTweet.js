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
            if (media) {
                let { media_id } = media
                return { text, media: { media_ids: [media_id] } }
            }
            return el
        })
    }

    const sendQuoteTweet = (ens, contest_hash, tweet) => {
        console.log(tweet)
        //let processed_thread = process_thread(tweet)
        authenticated_post('/twitter/sendQuoteTweet', { ens: ens, contest_hash: contest_hash, tweet: tweet })
            .then(res => console.log(res))
    }

    return {
        sendQuoteTweet: (ens, contest_hash, tweet) => { return sendQuoteTweet(ens, contest_hash, tweet) }
    }
}
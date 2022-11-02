import { useRef } from "react";
import { useWalletContext } from "../../app/WalletContext";
import { useParams } from "react-router-dom";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import useTweet from "../hooks/useTweet";
import { faTimes, faTrash, faImage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios'
import {
    ThreadWrap,
    TextAreaWrap,
    TextArea,
    TextAreaBottom,
    AddImageButton,
    RightAlignButtons,
    DeleteTweetButton,
    AddTweetButton,
    TweetButton,
    MediaContainer,
    TweetMedia,
    RemoveMediaButton,
    LinkedAccount,
    ThreadBar

} from './styles'


/** props
 * twitterdata
 * settwitterdata
 * account info
 * authstate
 * showTweetButton
 * handleSubmit
 */

export default function CreateThread(props) {

    return (
        <ThreadWrap>
            {props.twitterData.tweets.map((tweet, index) => {
                return <CreateTweet key={index} tweet_id={index} authState={props.authState} accountInfo={props.accountInfo} twitterData={props.twitterData} setTwitterData={props.setTwitterData} showTweetButton={props.showTweetButton} showTweetButton={props.showTweetButton} handleSubmit={props.handleSubmit}/>
            })}
        </ThreadWrap>
    )
}


function CreateTweet(props) {

    const mediaUploader = useRef(null);
    const textAreaRef = useRef(null);
    useAutosizeTextArea(textAreaRef.current, props.twitterData.tweets[props.tweet_id].text)

    const clearErrors = () => {
        if (props.twitterData.error) return props.setTwitterData({ type: 'update_single', payload: { error: null } })
    }

    const updateTweet = (e) => {
        props.setTwitterData({ type: 'update_tweet_text', payload: { index: props.tweet_id, value: e.target.value } })
        clearErrors();
    }

    const addTweet = () => {
        props.setTwitterData({ type: 'add_tweet' })
        clearErrors();
    }


    const deleteTweet = () => {
        props.setTwitterData({ type: 'delete_tweet', payload: props.tweet_id })
    }


    const focusTweet = () => {
        if (props.tweet_id !== props.twitterData.focus_tweet) {
            props.setTwitterData({ type: 'focus_tweet', payload: props.tweet_id })
            clearErrors();
        }
    }



    const handleMediaUpload = (e) => {
        console.log('handling media upload!!!')
        if (e.target.files.length === 0) return
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
            url: null
        }
        props.setTwitterData({ type: 'update_tweet_media_preview', payload: { index: props.tweet_id, value: img.preview } })
        const formData = new FormData();
        formData.append(
            "image",
            img.data
        )

        axios({
            method: 'post',
            url: '/creator_contests/twitter_contest_upload_img',
            data: formData
        }).then((response) => {
            console.log(response.data.file)
            props.setTwitterData({ type: 'update_tweet_media_phase_2', payload: { index: props.tweet_id, value: response.data.file } })
        })

    }



    return (
        <TextAreaWrap onClick={focusTweet} focused={props.twitterData.focus_tweet === props.tweet_id}>
            <RenderAccount authState={props.authState} accountInfo={props.accountInfo} twitterData={props.twitterData} tweet_id={props.tweet_id} />
            <TextArea ref={textAreaRef} onChange={updateTweet} value={props.twitterData.tweets[props.tweet_id].text} placeholder="What's happening?" focused={props.twitterData.focus_tweet === props.tweet_id} />
            <RenderMedia tweet={props.twitterData.tweets[props.tweet_id]} tweet_id={props.tweet_id} setTwitterData={props.setTwitterData} mediaUploader={mediaUploader} />
            <TextAreaBottom focused={props.twitterData.focus_tweet === props.tweet_id}>
                <input placeholder="Logo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleMediaUpload} ref={mediaUploader} />
                <AddImageButton disabled={props.twitterData.tweets[props.tweet_id].media?.preview} onClick={() => mediaUploader.current.click()}><FontAwesomeIcon icon={faImage} /></AddImageButton>
                <RightAlignButtons>
                    <DeleteTweetButton disabled={props.tweet_id === 0} onClick={deleteTweet}><FontAwesomeIcon icon={faTrash} /></DeleteTweetButton>
                    <AddTweetButton disabled={!props.twitterData.tweets[props.tweet_id]} onClick={addTweet}><FontAwesomeIcon icon={faPlus} /></AddTweetButton>
                    {props.showTweetButton && <TweetButton disabled={!props.twitterData.tweets[props.tweet_id]} onClick={props.handleSubmit}>{props.twitterData.tweets.length > 1 ? 'tweet all' : 'tweet'}</TweetButton>}
                </RightAlignButtons>
            </TextAreaBottom>
        </TextAreaWrap>
    )
}



function RenderMedia(props) {

    const removeMedia = () => {
        props.setTwitterData({ type: 'delete_tweet_media', payload: props.tweet_id })
        props.mediaUploader.current.value = null
    }


    if (props.tweet?.media) {
        return (
            <MediaContainer>
                <RemoveMediaButton onClick={removeMedia}><FontAwesomeIcon icon={faTimes} /></RemoveMediaButton>
                <TweetMedia src={props.tweet.media.preview} />
            </MediaContainer>
        )

    }
}


function RenderAccount(props) {
    if (props.authState === 2) {

        return (
            <LinkedAccount>
                <img src={props.accountInfo.profile_image_url} />
                <ThreadBar visible={(props.twitterData.tweets.length > 1) && (props.tweet_id != props.twitterData.tweets.length - 1)} />
            </LinkedAccount>
        )
    }
    return null
}
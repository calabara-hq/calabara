import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCheck, faImage, faTrash, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState, useRef } from "react"
import styled from 'styled-components'
import useTwitterAuth from "../../../../hooks/useTwitterAuth";
import { ToggleButton } from "../../common/common_components";
import { Contest_h3_alt } from "../../common/common_styles";
import Placeholder from "../../common/spinner";
import { fade_in } from "../../common/common_styles";
import { scaleElement } from "../../../../../css/scale-element";
import { useWalletContext } from "../../../../../app/WalletContext";
import { useParams } from "react-router-dom";
import useTweet from "../../../../hooks/useTweet";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectIsConnected } from "../../../../../app/sessionReducer";
import useAutosizeTextArea from "../../../../hooks/useAutosizeTextArea";



const TwitterWrap = styled.div`
    display: flex;
    flex-direction: column;
    &::before{
        content: '${props => props.title}';
        position: absolute;
        transform: translate(0%, -150%);
        color: #f2f2f2;
        font-size: 30px;
    }
    
    
`
const ParamsWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 20px auto;
    grid-gap: 20px;
    > * {
        margin-bottom: 30px;
    }
`

const Parameter = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
`

const LinkTwitterButton = styled.button`
    background-color: rgb(29, 155, 240);
    border: none;
    border-radius: 10px;
    width: 200px;
    padding: 10px 20px;
    font-weight: bold;
    &:hover{
        background-color: rgba(29, 155, 240, 0.8)
    }
    &:disabled{
        background-color: grey;
        color: lightgrey;
    }
`

const LinkTwitterWrap = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    position: relative;
`
const ConnectWalletButton = styled.button`
    border: none;
    border-radius: 10px;
    padding: 10px 15px;
    background-color: rgb(83,155,245);
    color: black;
    font-weight: bold;
    &:hover{
        background-color: rgba(83,155,245,0.8)
    }


`

export default function Twitter(props) {
    const { authState, auth_error, accountInfo, onOpen, destroySession } = useTwitterAuth()


    const destroy_session = () => {
        destroySession()
        props.setTwitterData({ type: 'reset_state' })
    }


    const toggleTwitter = () => {
        if (!props.twitterData.enabled) {
            props.setTwitterData({ type: 'update_single', payload: { stage: 1 } })
        }
        else {
            destroy_session()
            props.setTwitterData({ type: 'update_single', payload: { stage: 0 } })
        }
        props.setTwitterData({ type: 'update_single', payload: { enabled: !props.twitterData.enabled } })
    }



    return (
        <TwitterWrap title={"Twitter Integration"}>
            <ParamsWrap>
                <Parameter>
                    <Contest_h3_alt>Integrate Twitter</Contest_h3_alt>
                    <ToggleButton identifier={'twitter-toggle'} isToggleOn={props.twitterData.enabled} handleToggle={toggleTwitter} />
                    <p style={{ color: '#a3a3a3' }}>Collect submissions via twitter interactions </p>
                    <b></b>
                </Parameter>
                <ActionController authState={authState} onOpen={onOpen} accountInfo={accountInfo} twitterData={props.twitterData} setTwitterData={props.setTwitterData} auth_error={auth_error} />
            </ParamsWrap>
        </TwitterWrap>
    )
}


function ActionController(props) {
    const { walletConnect } = useWalletContext();
    const isWalletConnected = useSelector(selectIsConnected);
    useEffect(() => {
        console.log(props.authState)
        if (props.authState === 2) {
            props.setTwitterData({ type: 'update_single', payload: { stage: 2 } })
        }
    }, [props.authState])


    if (props.twitterData.stage === 1) {
        return (
            <>
                {props.twitterData.error === "invalid_auth" && <div className="tab-message error"><p>please authenticate your twitter account</p></div>}
                <LinkTwitterWrap>
                    {!isWalletConnected ? <ConnectWalletButton onClick={walletConnect}>Connect</ConnectWalletButton> : null}
                    <LinkTwitter onOpen={props.onOpen} accountInfo={props.accountInfo} twitterData={props.twitterData} setTwitterData={props.setTwitterData} auth_error={props.auth_error} />
                </LinkTwitterWrap>
            </>
        )
    }

    else if (props.twitterData.stage === 2) {
        return <CreateThread accountInfo={props.accountInfo} authState={props.authState} twitterData={props.twitterData} setTwitterData={props.setTwitterData} />
    }
}




const RetryWrap = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    gap: 20px;
    justify-content: center;
    align-items: center;

`


function LinkTwitter(props) {
    const isWalletConnected = useSelector(selectIsConnected);
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        props.setTwitterData({ type: 'update_single', payload: { error: null } })
        setLoading(true);
        props.onOpen('privileged')
    }


    if (!loading && !props.auth_error) { return <LinkTwitterButton disabled={!isWalletConnected} onClick={handleClick}><p style={{ marginBottom: '0px' }}><FontAwesomeIcon icon={faTwitter} /> Link Account</p></LinkTwitterButton> }
    else if (loading && !props.auth_error) return <div><Placeholder /></div>
    else if (props.auth_error) return (
        <RetryWrap>
            <div className="tab-message error"><p>Twitter authentication failed. Please try again</p></div>
            <LinkTwitterButton onClick={handleClick}><p style={{ marginBottom: '0px', margin: '0 auto' }}><FontAwesomeIcon icon={faTwitter} /> Retry</p></LinkTwitterButton>
        </RetryWrap>
    )

}

const TextAreaWrap = styled.div`
    background-color: orange;
    display: flex;
    flex-direction: column;
    //border: 2px solid #4d4d4d;
    background-color: ${props => props.focused ? '#262626' : 'rgba(26,26,26,0.9)'};
    //border-radius: 10px 10px 10px 10px;
    padding: 10px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    cursor: pointer;
    overflow: hidden;
`
const TextArea = styled.textarea`
    outline: none;
    font-size: 16px;
    border: none;
    background-color: transparent;
    border-radius: 10px;
    padding: 10px;
    width: 85%;
    color: ${props => props.focused ? '#d3d3d3' : 'grey'};
    cursor: ${props => props.focused ? 'text' : 'pointer'};
    margin-left: auto;
    resize: none;
    //transition: all 0.3s;
`




const TextAreaBottom = styled.div`
    //display: flex;
    width: 85%;
    border-top: 1px solid grey;
    margin-left: auto;
    padding: 10px 5px;
    display: ${props => props.focused ? 'flex' : 'none'};
    animation: ${fade_in} 0.2s ease-in-out;
`
const AddImageButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 5px 10px;
    border-radius: 100px;
    font-size: 20px;
    color: ${props => props.disabled ? 'grey' : 'rgba(29, 155, 240)'};
    cursor: ${props => props.disabled ? 'default' : 'pointer'};

    &:hover{
        background-color: ${props => props.disabled ? 'transparent' : 'rgba(29, 155, 240, 0.1)'};
    }
`


const RightAlignButtons = styled.div`
    display: flex;
    margin-left: auto;
    gap: 10px;
`


const AddTweetButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: none;
    padding: 0px 13px;
    border-radius: 100px;
    background-color: transparent;
    margin-left: auto;
    &:hover{
        background-color: rgba(29, 155, 240, 0.1);
    }
    &:disabled{
        visibility: hidden;
    }
`


const TweetButton = styled.button`
    background-color: rgba(29, 155, 240, 0.8);
    border: none;
    border-radius: 100px;
    padding: 5px 20px;
    font-weight: bold;
    ${scaleElement};
    &:disabled{
        background-color: rgba(29, 155, 240, 0.5);
        color: grey;
    }

`
const DeleteTweetButton = styled.div`
    cursor: pointer;
    display: ${props => props.disabled ? 'none' : 'flex'};
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: none;
    padding: 0px 13px;
    border-radius: 100px;
    background-color: transparent;
    margin-left: auto;
    &:hover{
        background-color: rgba(178,31,71,0.3);
    }
`

const ThreadWrap = styled.div`
    display: flex;
    flex-direction: column;
`

function CreateThread(props) {

    return (
        <ThreadWrap>
            <Contest_h3_alt>Announcement Tweet</Contest_h3_alt>
            <b></b>
            <p style={{ color: '#a3a3a3' }}>We'll tweet this for you once you're done </p>
            {props.twitterData.error === "empty_content" && <div className="tab-message error"><p>announcement tweet can't be empty</p></div>}
            <b style={{ marginBottom: '30px' }}></b>
            {props.twitterData.tweets.map((tweet, index) => {
                return <CreateTweet key={index} tweet_id={index} authState={props.authState} accountInfo={props.accountInfo} twitterData={props.twitterData} setTwitterData={props.setTwitterData} />
            })}
        </ThreadWrap>

    )

}



function CreateTweet(props) {
    const { authenticated_post } = useWalletContext();
    const { ens, contest_hash } = useParams();
    const { sendQuoteTweet } = useTweet();
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
                </RightAlignButtons>
            </TextAreaBottom>
        </TextAreaWrap>
    )
}

const MediaContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 85%;
    margin-left: auto;
    padding-bottom: 20px;
    position: relative;
`

const TweetMedia = styled.img`
    max-width: 35em;
    grid-area: ${props => props.index};
    border-radius: 20px;
`
const RemoveMediaButton = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 5px;
    left: 5px;
    border-radius: 100px;
    padding: 5px 10px;
    width: 40px;
    height: 40px;
    background-color: rgb(0, 0, 0, 0.7);
    ${scaleElement};
    &:hover{
        background-color: rgba(178,31,71,0.3);
    }

`

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



const LinkedAccount = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    > img{
        border-radius: 100px;
        max-width: 10em;
    }
`


const ThreadBar = styled.div`
    background-color: white;
    width: 3px;
    height: 60em;
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
`


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

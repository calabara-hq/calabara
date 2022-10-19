import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { CreateSubmissionButtonContainer } from "../../../prompts/styles";
import { CancelButton, CreateSubmissionContainer, SubmissionActionButtons } from "../submission-builder-styles";
import { faCirclePlus, faImage, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import useTwitterAuth from "../../../../../../hooks/useTwitterAuth";
import styled from 'styled-components'
import { socket } from "../../../../../../../service/socket";
import axios from "axios";
import { useWalletContext } from "../../../../../../../app/WalletContext";
import { useParams } from "react-router-dom";
import useTweet from "../../../../../../hooks/useTweet";
import { TwitterSubmissionCheckpointBar } from "../../../../../../checkpoint-bar/checkpoint-bar";
import { scaleElement } from "../../../../../../../css/scale-element";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import Placeholder from '../../../../common/spinner'
import { fade_in } from "../../../../common/common_styles";

const TwitterSubmissionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
    width: 100%;

`

const CheckpointWrap = styled.div`
    background-color: #141416;
    border-radius: 10px;
    width: 90%;
    margin: 0 auto;
    padding: 10px 0px;

`
const CheckpointBottom = styled.div`
    margin: 0 auto;
    background-color: pink;
    height: fit-content;
    width: 95%;
    color: #d3d3d3;
    margin-bottom: 0em;
    animation: ${fade_in} 0.8s ease-in-out;

    .RSPBprogressBar > .RSPBstep:nth-child(1)::after {
      text-align: center;
      content: "submit method";
      width: 100px;
      color: grey;
      position: absolute;
      top: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(2)::after {
      text-align: center;
      content: "authorize";
      color: grey;
      position: absolute;
      top: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(3)::after {
      text-align: center;
      content: "tweet";
      color: grey;
      position: absolute;
      top: 2em;
    }
`


const ContentWrap = styled.div`
    align-self: flex-start;
    width: 100%;
    margin-left: auto;
`

function reducer(state, action) {
    switch (action.type) {
        case 'update_single':
            return { ...state, ...action.payload };
        case 'focus_tweet':
            return {
                ...state,
                focus_tweet: action.payload
            }
        case 'add_tweet': // dont work
            return {
                ...state,
                tweets: [...state.tweets, { text: "" }],
                focus_tweet: state.tweets.length
            }
        case 'update_tweet_text': // works
            return {
                ...state,
                tweets: [
                    ...state.tweets.slice(0, action.payload.index),
                    state.tweets[action.payload.index] = { text: action.payload.value },
                    ...state.tweets.slice(action.payload.index + 1)
                ]
            }
        case 'delete_tweet':
            return {
                ...state,
                tweets: [
                    ...state.tweets.slice(0, action.payload),
                    ...state.tweets.slice(action.payload + 1)
                ],
                focus_tweet: action.payload - 1
            }
        default:
            throw new Error();
    }
}

const initial_state = {
    stage: 0,
    auth_type: null,
    focus_tweet: 0,
    tweets: [{ text: "" }]


}


export default function TwitterSubmissionBuilder({ handleExitSubmission, isUserEligible, handleCloseDrawer }) {
    const { authState, auth_error, authLink, accountInfo, getAuthLink, onOpen } = useTwitterAuth()
    const [builderData, setBuilderData] = useReducer(reducer, initial_state)

    const destroy_session = () => {
        fetch('/twitter/destroy_session')
            .then(() => console.log('session destroyed'))
    }

    useEffect(() => {
        return () => {
            console.log('should destroy session')
        }
    }, [])

    useEffect(() => {
        console.log(builderData.tweets)
    }, [builderData.tweets])

    return (
        <CreateSubmissionContainer>
            <SubmissionActionButtons>
            </SubmissionActionButtons>
            {/*<button style={{ color: 'black' }} onClick={destroy_session}>destroy session</button>*/}
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Create Submission</h2>
            <TwitterSubmissionContainer>
                <CheckpointWrap>
                    <CheckpointBottom>
                        <TwitterSubmissionCheckpointBar percent={builderData.stage * 50} />
                    </CheckpointBottom>
                </CheckpointWrap>
                <ContentWrap>
                    <ActionsController builderData={builderData} setBuilderData={setBuilderData} authState={authState} authLink={authLink} accountInfo={accountInfo} getAuthLink={getAuthLink} onOpen={onOpen} auth_error={auth_error} />
                </ContentWrap>
            </TwitterSubmissionContainer>
        </CreateSubmissionContainer>
    )
}


// stage 0: auth choice + get link
// stage 1: use link for popup. Render account + loading button
// stage 2: create tweet



function ActionsController(props) {

    useEffect(() => {
        if (props.authState === 2) return props.setBuilderData({ type: 'update_single', payload: { stage: 2 } })
    }, [props.authState])

    if (props.builderData.stage === 0) {
        return <AuthChoice builderData={props.builderData} setBuilderData={props.setBuilderData} onOpen={props.onOpen} />
    }

    else if (props.builderData.stage === 1) {

        return (
            <LinkTwitterWrap>
                <LinkTwitter onOpen={props.onOpen} auth_error={props.auth_error} />
            </LinkTwitterWrap>
        )
    }

    else if (props.builderData.stage === 2) {
        return <CreateThread accountInfo={props.accountInfo} authState={props.authState} builderData={props.builderData} setBuilderData={props.setBuilderData} />
    }
}

const AuthChoiceWrap = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    gap: 20px;
`

const AuthChoiceButton = styled.button`
    width: 50%;
    height: 200px;
    border-radius: 10px;
    background-color: #2a2a2a;
    border: 2px solid transparent;
    font-size: 16px;
    &:hover{
        background-color: #2f2f2f;
    }
    ${scaleElement}
`


function AuthChoice(props) {

    const handleChoice = (choice) => {
        props.setBuilderData({ type: 'update_single', payload: { auth_type: choice, stage: 1 } })
    }


    return (
        <AuthChoiceWrap>
            <AuthChoiceButton onClick={() => handleChoice('privelaged')}>tweet for me</AuthChoiceButton>
            <AuthChoiceButton onClick={() => handleChoice('standard')}>gen link</AuthChoiceButton>
        </AuthChoiceWrap>
    )
}


// auth state = 2: ready
// auth state = 1: loading

// intialize to 0
// on click, set loading
// stop loading on error or ready
// ready will auto set to the next stage
// 


const LinkTwitterWrap = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    width: 80%;
    height: 100px;
    margin: 0 auto;
`

const LinkTwitterButton = styled.button`
    background-color: rgba(29, 155, 240, 0.8);
    border: none;
    border-radius: 10px;
    width: 200px;
    padding: 10px 20px;
    font-weight: bold;
    ${scaleElement}
    &:hover{
        //background-color: rgba(29, 155, 240)
    }
`

function LinkTwitter(props) {
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        setLoading(true)
        props.onOpen()
    }



    if (!loading && !props.auth_error) return <LinkTwitterButton onClick={handleClick}><FontAwesomeIcon icon={faTwitter} /> link twitter</LinkTwitterButton>
    else if (loading && !props.auth_error) return <div><Placeholder /></div>
    else if (props.auth_error) return (
        <div>
            <p>there was a problem</p>
            <button>retry</button>
        </div>
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
    height:  ${props => props.focused ? '15em' : 'auto'};
    cursor: ${props => props.focused ? 'text' : 'pointer'};
    margin-left: auto;
    resize: none;
    transition: all 0.3s;
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
const TwitterHelperButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 5px 10px;
    border-radius: 100px;
    font-size: 20px;
    color: rgba(29, 155, 240);

    &:hover{
        background-color: rgba(29, 155, 240, 0.1);
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
        background-color: rgba(178,31,71,0.3);
    }
    &:disabled{
        visibility: hidden;
    }
`

const ThreadWrap = styled.div`
    display: flex;
    flex-direction: column;
    //gap: 10px;
`

function CreateThread(props) {

    return (
        <ThreadWrap>
            {props.builderData.tweets.map((tweet, index) => {
                return <CreateTweet key={index} tweet_id={index} authState={props.authState} accountInfo={props.accountInfo} builderData={props.builderData} setBuilderData={props.setBuilderData} />
            })}
        </ThreadWrap>

    )

}



function CreateTweet(props) {
    const { authenticated_post } = useWalletContext();
    const { ens, contest_hash } = useParams();
    const { sendQuoteTweet } = useTweet();

    const updateTweet = (e) => {
        props.setBuilderData({ type: 'update_tweet_text', payload: { index: props.tweet_id, value: e.target.value } })
    }

    const addTweet = () => {
        props.setBuilderData({ type: 'add_tweet' })
    }


    const deleteTweet = () => {
        props.setBuilderData({ type: 'delete_tweet', payload: props.tweet_id })
    }


    const focusTweet = () => {
        if (props.tweet_id !== props.builderData.focus_tweet) {
            props.setBuilderData({ type: 'focus_tweet', payload: props.tweet_id })
        }
    }


    return (
        <TextAreaWrap onClick={focusTweet} focused={props.builderData.focus_tweet === props.tweet_id}>
            <RenderAccount authState={props.authState} accountInfo={props.accountInfo} builderData={props.builderData} tweet_id={props.tweet_id} />
            <TextArea onChange={updateTweet} placeholder="What's happening?" focused={props.builderData.focus_tweet === props.tweet_id} />
            <TextAreaBottom focused={props.builderData.focus_tweet === props.tweet_id}>
                <TwitterHelperButton><FontAwesomeIcon icon={faImage} /></TwitterHelperButton>
                <RightAlignButtons>
                    <DeleteTweetButton disabled={props.tweet_id === 0} onClick={deleteTweet}><FontAwesomeIcon icon={faTrash} /></DeleteTweetButton>
                    <AddTweetButton disabled={!props.builderData.tweets[props.tweet_id]} onClick={addTweet}><FontAwesomeIcon icon={faPlus} /></AddTweetButton>
                    <TweetButton disabled={!props.builderData.tweets[props.tweet_id]} onClick={() => sendQuoteTweet(ens, contest_hash, props.builderData.tweets)}>{props.builderData.tweets.length > 1 ? 'tweet all' : 'tweet'}</TweetButton>
                </RightAlignButtons>
            </TextAreaBottom>
        </TextAreaWrap>
    )
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
    height: 30em;
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
`


function RenderAccount(props) {
    if (props.authState === 2) {

        return (
            <LinkedAccount>
                <img src={props.accountInfo.profile_image_url} />
                <ThreadBar visible={(props.builderData.tweets.length > 1) && (props.tweet_id != props.builderData.tweets.length - 1)} />
            </LinkedAccount>
        )
    }
    return null
}

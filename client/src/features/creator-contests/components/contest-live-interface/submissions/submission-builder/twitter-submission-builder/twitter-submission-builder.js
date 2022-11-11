import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { TwitterSubmissionCheckpointBar } from "../../../../../../checkpoint-bar/checkpoint-bar";
import CreateThread from "../../../../../../create-twitter-thread/create-thread";
import useTweet from "../../../../../../hooks/useTweet";
import useTwitterAuth from "../../../../../../hooks/useTwitterAuth";
import TwitterThreadReducer, { twitter_initial_state } from "../../../../../../reducers/twitter-thread-reducer";
import LinkTwitter from "../../../../../../twitter-link-account/link-twitter";
import Placeholder from '../../../../common/spinner';
import axios from 'axios'
import styled from 'styled-components'
import {
    CreateSubmissionContainer,
    SavingSubmissionDiv,
    SubmissionActionButtons
} from "../submission-builder-styles";
import {
    AuthChoiceButton, AuthChoiceWrap, CheckpointBottom, CheckpointWrap, ContentWrap, LinkTwitterWrap, TwitterSubmissionContainer
} from './styles';
import { LinkTwitterButton } from "../../../../../../twitter-link-account/styles";
import { fade_in } from "../../../../common/common_styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";
import { selectIsTwitterLinked } from "../../../../../../user/user-reducer";


export default function TwitterSubmissionBuilder({ handleExitSubmission, isUserEligible, handleCloseDrawer }) {
    const { authState, auth_error, authLink, accountInfo, getAuthLink, onOpen, destroySession } = useTwitterAuth()
    const [builderData, setBuilderData] = useReducer(TwitterThreadReducer, twitter_initial_state)

    const destroy_session = () => {
        destroySession()
        setBuilderData({ type: 'reset_state' })
    }

    return (
        <CreateSubmissionContainer>
            <SubmissionActionButtons>
            </SubmissionActionButtons>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Create Submission</h2>
            <TwitterSubmissionContainer>
                <CheckpointWrap>
                    <CheckpointBottom>
                        <TwitterSubmissionCheckpointBar percent={builderData.stage * 50} />
                    </CheckpointBottom>
                </CheckpointWrap>
                <ContentWrap>
                    <TwitterDescription builderData={builderData} />
                    <ActionsController
                        builderData={builderData}
                        setBuilderData={setBuilderData}
                        authState={authState}
                        authLink={authLink}
                        accountInfo={accountInfo}
                        getAuthLink={getAuthLink}
                        onOpen={onOpen}
                        auth_error={auth_error}
                        handleCloseDrawer={handleCloseDrawer}
                        destroy_session={destroy_session}
                    />
                </ContentWrap>
            </TwitterSubmissionContainer>
        </CreateSubmissionContainer>
    )
}

const DescriptionBox = styled.div`
    background-color: #2a2a2a;
    border-radius: 10px;
    border: 3px solid #141416;
    color: #d3d3d3;
    padding: 10px;
    position: relative;
    font-size: 16px;
    > span{
        position: absolute;
        right: 10px;
        top: 10px;
    }
    > li {
        margin-left: 20px;
        margin-bottom: 10px;
    }

`

function TwitterDescription(props) {
    if (props.builderData.stage === 0) {
        return (
            <DescriptionBox style={{ width: '80%', margin: '0 auto' }}>
                <span><FontAwesomeIcon icon={faExclamationCircle} style={{ color: '#6673ff', fontSize: '20px' }} /></span>
                <p> This is a twitter contest </p>
                <p>To submit, you must link your twitter and quote tweet the announcement tweet with your submission</p>
                <p>Pick a submission method to continue</p>
                <li><i style={{ fontWeight: 'bold' }}>Tweet for me ~</i> link my twitter and tweet my submission for me</li>
                <li><i style={{ fontWeight: 'bold' }}>Generate link ~</i> link my twitter and I'll tweet it myself</li>
            </DescriptionBox>
        )
    }
}


// stage 0: auth choice + get link
// stage 1: use link for popup. Render account + loading button
// stage 2: create tweet



function ActionsController(props) {
    const { ens, contest_hash } = useParams();
    const [isSaving, setIsSaving] = useState(false)
    const { sendQuoteTweet } = useTweet();
    useEffect(() => {
        if (props.authState === 2) return props.setBuilderData({ type: 'update_single', payload: { stage: 2 } })
    }, [props.authState])



    const handleSubmit = async () => {
        setIsSaving(true)
        await sendQuoteTweet(ens, contest_hash, props.builderData.tweets)
            .then(res => {
                setTimeout(() => {
                    props.handleCloseDrawer();
                    props.destroy_session();
                }, 500)
            })
            .catch(err => setIsSaving(false))
    }

    if (isSaving) {
        return (
            <SavingSubmissionDiv>
                <Placeholder />
            </SavingSubmissionDiv>
        )
    }


    if (props.builderData.stage === 0) {
        return <AuthChoice
            builderData={props.builderData}
            setBuilderData={props.setBuilderData}
            onOpen={props.onOpen} />
    }
    else if (props.builderData.stage === 1) {
        return (
            <LinkTwitterWrap>
                <LinkTwitter
                    onOpen={props.onOpen}
                    auth_error={props.auth_error}
                    auth_type={props.builderData.auth_type}
                    clearErrors={() => props.setBuilderData({ type: 'update_single', payload: { error: null } })}
                />
            </LinkTwitterWrap>
        )
    }

    else if (props.builderData.stage === 2) {
        if (props.builderData.auth_type === 'privileged') {
            return <CreateThread
                accountInfo={props.accountInfo}
                authState={props.authState}
                twitterData={props.builderData}
                setTwitterData={props.setBuilderData}
                handleSubmit={handleSubmit}
                showTweetButton={true}
            />
        }
        else if (props.builderData.auth_type === 'standard') return <TwitterRedirect handleCloseDrawer={props.handleCloseDrawer} />
    }
}

function AuthChoice(props) {
    const isTwitterConnected = useSelector(selectIsTwitterLinked)

    const handleChoice = (choice) => {
        let stage = 1
        // dont ask them to connect again if their twitter is already hooked up and simple auth is chosen
        if ((choice === 'standard') && isTwitterConnected) stage = 2
        props.setBuilderData({ type: 'update_single', payload: { auth_type: choice, stage: stage } })
    }


    return (
        <AuthChoiceWrap>
            <AuthChoiceButton onClick={() => handleChoice('privileged')}>Tweet for me</AuthChoiceButton>
            <AuthChoiceButton onClick={() => handleChoice('standard')}>Generate a link</AuthChoiceButton>
        </AuthChoiceWrap>
    )
}



const RedirectWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 80%;
    height: 100px;
    margin: 30px auto;
    animation: ${fade_in} 0.3s ease-in-out;
    > p{
        font-size: 16px;
    }
`


function TwitterRedirect(props) {
    const { ens, contest_hash } = useParams()

    const handleClick = async () => {
        let intent = await axios.post('/twitter/generate_quote_intent', { ens: ens, contest_hash: contest_hash })
            .then(res => res.data)
            .catch(err => console.log(err))
        window.open(intent)
        props.handleCloseDrawer();
    }

    return (
        <RedirectWrap>
            <p style={{ marginBottom: '20px' }}>All set! Head to twitter and quote tweet the contest announcement with your submission. </p>
            <LinkTwitterButton onClick={handleClick}>take me there</LinkTwitterButton>
        </RedirectWrap>
    )
}
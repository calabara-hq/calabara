import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useRef, useState } from "react";
import useTwitterAuth from "../../../../../../hooks/useTwitterAuth";
import styled from 'styled-components'
import { useParams } from "react-router-dom";
import useTweet from "../../../../../../hooks/useTweet";
import { TwitterSubmissionCheckpointBar } from "../../../../../../checkpoint-bar/checkpoint-bar";
import { scaleElement } from "../../../../../../../css/scale-element";
import Placeholder from '../../../../common/spinner'
import CreateThread from "../../../../../../create-twitter-thread/create-thread";
import LinkTwitter from "../../../../../../twitter-link-account/link-twitter";
import TwitterThreadReducer, { twitter_initial_state } from "../../../../../../reducers/twitter-thread-reducer";
import {
    CreateSubmissionContainer,
    SavingSubmissionDiv,
    SubmissionActionButtons
} from "../submission-builder-styles";
import {
    TwitterSubmissionContainer,
    CheckpointWrap,
    CheckpointBottom,
    ContentWrap
} from './styles'


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
                    setTwitterData={props.setBuilderData}
                />
            </LinkTwitterWrap>
        )
    }

    else if (props.builderData.stage === 2) {
        return <CreateThread
            accountInfo={props.accountInfo}
            authState={props.authState}
            twitterData={props.builderData}
            setTwitterData={props.setBuilderData}
            handleSubmit={handleSubmit}
            showTweetButton={true}
        />
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
const LinkTwitterWrap = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    width: 80%;
    height: 100px;
    margin: 0 auto;
`

function AuthChoice(props) {

    const handleChoice = (choice) => {
        props.setBuilderData({ type: 'update_single', payload: { auth_type: choice, stage: 1 } })
    }


    return (
        <AuthChoiceWrap>
            <AuthChoiceButton onClick={() => handleChoice('privileged')}>tweet for me</AuthChoiceButton>
            <AuthChoiceButton onClick={() => handleChoice('standard')}>gen link</AuthChoiceButton>
        </AuthChoiceWrap>
    )
}


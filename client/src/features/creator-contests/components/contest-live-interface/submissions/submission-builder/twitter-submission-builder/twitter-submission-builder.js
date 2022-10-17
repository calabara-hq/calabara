import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { CreateSubmissionButtonContainer } from "../../../prompts/styles";
import { CancelButton, CreateSubmissionContainer, SubmissionActionButtons } from "../submission-builder-styles";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useTwitterAuth from "../../../../../../hooks/useTwitterAuth";
import styled from 'styled-components'
import { socket } from "../../../../../../../service/socket";

const LinkedAccount = styled.div`
    display: flex;
    margin-left: 100px;
    background-color: rgba(29, 155, 240, 0.8);
    border-radius: 10px;
    font-weight: bold;
    padding: 10px;
    align-items: flex-end;

    > img{
        border-radius: 100px;
        max-width: 10em;
        margin-right: 10px;
    }
`





export default function TwitterSubmissionBuilder({ handleExitSubmission, isUserEligible, handleCloseDrawer }) {
    const { authState, authLink, accountInfo, getAuthLink, onOpen } = useTwitterAuth()
    const [stage, setStage] = useState(0);

    const destroy_session = () => {
        fetch('/twitter/destroy_session')
            .then(() => console.log('session destroyed'))
    }

    useEffect(() => {
        if(socket.connected){
            console.log('socket is connected!!')
        }
    }, [])

    return (
        <CreateSubmissionContainer>
            <SubmissionActionButtons>
            </SubmissionActionButtons>
            <button style={{ color: 'black' }} onClick={destroy_session}>destroy session</button>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Create Submission</h2>
            <RenderAccount authState={authState} accountInfo={accountInfo} />
            <ActionsController stage={stage} setStage={setStage} authState={authState} authLink={authLink} accountInfo={accountInfo} getAuthLink={getAuthLink} onOpen={onOpen} />
        </CreateSubmissionContainer>
    )
}


function ActionsController(props) {

    useEffect(() => {
        if (props.authLink) return props.setStage(1)
    }, [props.authLink])

    useEffect(() => {
        if (props.authState === 2) return props.setStage(2)
    }, [props.authState])

    if (props.stage === 0) {
        return <AuthChoice getAuthLink={props.getAuthLink} setStage={props.setStage} />
    }

    else if (props.stage === 1) {
        return <LinkTwitter onOpen={props.onOpen} />
    }

    else if (props.stage === 2) {
        return <CreateThread />
    }
}



function AuthChoice(props) {
    const handleClick = () => {
        props.getAuthLink()
    }
    return <button style={{ color: 'black' }} onClick={handleClick}>tweet for me</button>
}


function LinkTwitter(props) {

    return <button onClick={props.onOpen} style={{ color: 'black' }}>link twitter</button>
}

function CreateThread({ }) {
    const handleClick = () => {
        alert('tweeting!!!')
    }
    return (
        <div>
            <h3>Tweet</h3>
            <textarea style={{ color: 'black', outline: 'none' }}></textarea>
            <button style={{ color: 'black' }} onClick={handleClick}>submit and tweet</button>
        </div>
    )

}


function RenderAccount(props) {
    if (props.authState === 2) {
        return (
            <LinkedAccount>
                <img src={props.accountInfo.user.profile_image_url} />
                <p style={{ marginBottom: '0px' }}>@{props.accountInfo.user.username}</p>
            </LinkedAccount>
        )
    }
    return null
}

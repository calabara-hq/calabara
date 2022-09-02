import { useState, useRef, useCallback } from 'react'
import styled, { css, keyframes } from 'styled-components'
import TLDR from './TLDR-editor'
import { createReactEditorJS } from 'react-editor-js'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { fade_in, WarningMessage } from '../../common/common_styles'
import useCommon from '../../../../hooks/useCommon'
import { EDITOR_JS_TOOLS } from '../../contest_settings/prompt_builder/editor_tools'


const CreateSubmissionContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    align-items: stretch;
    //justify-content: space-between;
    background-color: #1e1e1e;
    padding: 10px;
    border: none;
    border-radius: 10px;
    height: none;
    > * {
        margin-bottom: 15px;
        margin-top: 15px;
    }
`

const SubmissionActionButtons = styled.div`
    width: fit-content;
    position: absolute;
    margin-left: auto;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

const SubmitButton = styled.button`
    align-self: center;
    margin-left: auto;
    margin-right: 10px;
    border: 2px solid #22272e;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: rgb(6, 214, 160);
    color: black;
    &:hover{
        color: black;
        background-color: rgba(6, 214, 160, 0.8);
        &::before{
            content: "save";
            position: absolute;
            border: none;
            background-color: #444c56;
            padding: 3px;
            border-radius: 4px;
            top: 0;
            color: lightgrey;
            transform: translate(-50%, -150%);
            animation: ${fade_in} 0.5s ease-in-out;
        }
    }
`
const CancelButton = styled.button`
    border: 2px solid #4d4d4d;
    color: grey;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: transparent;
    margin-right: 10px;
    &:hover{
        color: #d3d3d3;
        background-color: rgba(34, 34, 46, 0.8);
        border: 2px solid #d3d3d3;
        &::before{
            content: "cancel";
            position: absolute;
            border: none;
            background-color: #1e1e1e;
            padding: 3px;
            border-radius: 4px;
            top: 0;
            color: lightgrey;
            transform: translate(-50%, -150%);
            animation: ${fade_in} 0.5s ease-in-out;
        }
    }
`

export default function SubmissionBuilder({ handleCloseDrawer, restrictionResults, isUserEligible }) {
    const [TLDRImage, setTLDRImage] = useState(null)
    const [TLDRText, setTLDRText] = useState('')
    const [longFormValue, setLongFormValue] = useState(null)
    const { ens, contest_hash } = useParams();
    const ReactEditorJS = createReactEditorJS();
    const editorCore = useRef(null);
    const { authenticated_post } = useCommon();
    const errorCheck = async () => {
        if (!TLDRText && !TLDRImage) {
            alert('at least one TLDR field required!')
            return true
        }
        else return false;
    }


    const handleClose = () => {
        if (TLDRImage || TLDRText) {
            if (window.confirm('you\'re changes will be lost. Do you want to proceed?')) {
                handleCloseDrawer();
            }
            else return
        }
        else {
            handleCloseDrawer();
        }
    }

    const handleSubmit = async () => {
        let isError = await errorCheck();
        if (isError) return;
        let editorData = await editorCore.current.save();
        let submission = {
            tldr_text: TLDRText,
            tldr_image: TLDRImage != null ? TLDRImage.url : null,
            submission_body: editorData
        }
        let res = await authenticated_post('/creator_contests/create_submission', { ens: ens, contest_hash: contest_hash, submission: submission });
    }
    console.log('hi')
    console.log(Object.values(restrictionResults))
    return (
        <>
            <CreateSubmissionContainer>

                <SubmissionActionButtons>
                    <CancelButton onClick={handleClose}><FontAwesomeIcon icon={faTimes} /></CancelButton>
                    <SubmitButton onClick={handleSubmit}><FontAwesomeIcon icon={faCheck} /></SubmitButton>
                </SubmissionActionButtons>
                <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Create Submission</h2>
                <EditTLDR isUserEligible={isUserEligible} TLDRimage={TLDRImage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />
                <EditLongForm longFormValue={longFormValue} setLongFormValue={setLongFormValue} ReactEditorJS={ReactEditorJS} editorCore={editorCore} />

            </CreateSubmissionContainer>
        </>
    )
}

function EditTLDR({ isUserEligible, TLDRimage, setTLDRImage, TLDRText, setTLDRText }) {
    const [showWarning, setShowWarning] = useState(false);
    return (
        <>
            <div style={{ width: '50%' }}>
                <h2 style={{ textAlign: 'left', color: '#d3d3d3' }}>TLDR</h2>
                <p style={{ color: 'grey' }}>This is what visitors will see on the submission section</p>
            </div>
            {showWarning && <WarningMessage style={{ marginBottom: '10px' }}>You may not be eligible to submit</WarningMessage>}
            <TLDR setShowWarning={setShowWarning} isUserEligible={isUserEligible} TLDRimage={TLDRimage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />
        </>
    )
}

function EditLongForm({ longFormValue, setLongFormValue, ReactEditorJS, editorCore }) {

    return (
        <div>
            <div>
                <h2 style={{ textAlign: 'left', color: '#d3d3d3' }}>Submission</h2>
                <p style={{ color: 'grey' }}>What a visitor sees when your content is expanded</p>
            </div>
            <SubmissionEdit longFormValue={longFormValue} setLongFormValue={setLongFormValue} ReactEditorJS={ReactEditorJS} editorCore={editorCore} />
        </div>

    )
}

const EditorWrap = styled.div`
    background-color: white;
    border-radius: 10px;
    border: 2px solid #4d4d4d;
    font-size: 18px;
    text-align: left;
    padding: 10px;
    background-color: #262626;
    max-height: 80vh;
    width: 100%;
    margin: 0 auto;
    overflow-y: scroll;
    color: white;
    * > .ce-popover--opened{
        color: black;
    }
    * > .ce-inline-toolbar{
        color: black;
    }
    * > .ce-toolbar__settings-btn, .ce-toolbar__plus{
        background-color: #d3d3d3;
    }
    * > .ce-toolbar__settings-btn:hover, .ce-toolbar__plus:hover{
        background-color: white;
    }
`


function SubmissionEdit({ ReactEditorJS, editorCore, longFormValue, setLongFormValue }) {

    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])



    return (
        <EditorWrap>
            <ReactEditorJS defaultValue={longFormValue} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
        </EditorWrap>
    )
}
import { useState, useRef } from 'react'
import styled from 'styled-components'
import TLDR from './TLDR-editor'
import { createReactEditorJS } from 'react-editor-js'
import SubmissionEdit from './submission-builder-2'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { fade_in } from '../../common/common_styles'

const CreateSubmissionContainer = styled.div`
display: flex;
position: relative;
flex-direction: column;
flex-wrap: wrap;
justify-content: space-between;
background-color: #1d1d1d;
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
    border: 2px solid #444c56;
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

export default function SubmissionBuilder({ setIsSubmissionBuilder, setCreateSubmissionIndex }) {
    const [TLDRImage, setTLDRImage] = useState(null)
    const [TLDRText, setTLDRText] = useState('')
    const [longFormValue, setLongFormValue] = useState(null)
    const { ens, contest_hash } = useParams();

    const ReactEditorJS = createReactEditorJS();
    const editorCore = useRef(null);


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
                setIsSubmissionBuilder(false);
                setCreateSubmissionIndex(-1)
            }
            else return
        }
        else {
            setIsSubmissionBuilder(false);
            setCreateSubmissionIndex(-1)
        }
    }

    const handleSubmit = async () => {
        /*
                let tldr = {
                    tldr_text: TLDRText,
                    tldr_image: ''//TLDRImage.url
                }
        */

        let isError = await errorCheck();
        if (isError) return;
        let editorData = await editorCore.current.save();
        let submission = {
            tldr_text: TLDRText,
            tldr_image: TLDRImage.url,
            submission_body: editorData
        }
        let res = await axios.post('/creator_contests/create_submission', { ens: ens, contest_hash: contest_hash, submission: submission })
    }

    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Create Submission</h2>
            <CreateSubmissionContainer>
                <SubmissionActionButtons>
                    <CancelButton onClick={handleClose}><FontAwesomeIcon icon={faTimes} /></CancelButton>
                    <SubmitButton onClick={handleSubmit}><FontAwesomeIcon icon={faCheck} /></SubmitButton>
                </SubmissionActionButtons>
                <EditTLDR TLDRimage={TLDRImage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />
                <EditLongForm longFormValue={longFormValue} setLongFormValue={setLongFormValue} ReactEditorJS={ReactEditorJS} editorCore={editorCore} />
            </CreateSubmissionContainer>
        </>
    )
}

function EditTLDR({ setProgress, TLDRimage, setTLDRImage, TLDRText, setTLDRText }) {
    return (
        <>
            {/*
            <div className='tab-message neutral'>
                <p>The TLDR section allows you to create the preview text and image that a user will see while viewing submissions. At least one of the fields (image or text) is required. Any additional content you wish to add will only be visible if a user expands your submission, which can be done in the next step.</p>
            </div>
    */}
            <div style={{ width: '50%' }}>
                <h2 style={{ textAlign: 'left', color: '#d3d3d3' }}>TLDR</h2>
                <p style={{ color: 'grey' }}>This is what visitors will see on the submission section</p>
            </div>
            <TLDR TLDRimage={TLDRimage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />
        </>
    )
}

function EditLongForm({ longFormValue, setLongFormValue, ReactEditorJS, editorCore }) {



    return (
        <div>
            {/*
            <div className='tab-message neutral'>
                <p>This section allows you to create longer form content that will only be visible if a user expands your submission.</p>
            </div>
    */}
            <div>
                <h2 style={{ textAlign: 'left', color: '#d3d3d3' }}>Submission</h2>
                <p style={{ color: 'grey' }}>What a visitor sees when your content is expanded</p>
            </div>
            <SubmissionEdit longFormValue={longFormValue} setLongFormValue={setLongFormValue} ReactEditorJS={ReactEditorJS} editorCore={editorCore} />
        </div>

    )
}
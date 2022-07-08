import React, { useState, useEffect, useReducer, useRef } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../../../css/status-messages.css';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SubmissionEdit from './submission-builder-2';
import TLDR from './TLDR-editor';
import { createReactEditorJS } from 'react-editor-js'
import PreviewSubmission from './preview-submission';
import { ParseBlocks } from './block-parser';
import { Label } from '../common/common_styles';
import { ContestSubmissionCheckpointBar } from '../../../checkpoint-bar/checkpoint-bar';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    bgcolor: '#1d1d1d',
    border: '2px solid rgba(29, 29, 29, 0.3)',
    boxShadow: 20,
    p: 4,
    borderRadius: '20px',
    height: 'auto',
    minHeight: '80vh',
    // maxWidth: '1130px',
    minWidth: '350px'
};

const ModalWrapper = styled.div`
    color: #d3d3d3;
    display: flex;
    flex-direction: column;
    gap: 50px;
`
const NextButton = styled.button`
    position: absolute;
    right: 30px;
    bottom: 10px;
    color: white;
    background-color: #00a368;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
`
const PreviousButton = styled.button`
    position: absolute;
    left: 30px;
    bottom: 10px;
    color: white;
    background-color: #2d2e35;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
`

const labelColorOptions = [
    { text: 'transparent', background: 'transparent' },
    { text: 'rgb(234, 203, 195)', background: 'rgba(234, 203, 195,0.3)' },
    { text: 'rgb(162, 114, 141)', background: 'rgba(162, 114, 141, 0.3)' },
    { text: 'rgb(104, 160, 170)', background: 'rgba(104, 160, 170, 0.3)' },
    { text: 'rgb(111, 208, 140)', background: 'rgba(111, 208, 140, 0.3)' },
]

const ExitButton = styled.button`
    position: absolute;
    right: 30px;
    top: 10px;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-weight: bold;
    background-color: #2d2e35;
    color: lightcoral;
    
`
const CheckpointWrap = styled.div`
    margin: 0 auto;
    width: 70%;
    color: #d3d3d3;
    margin-bottom: 20px;

    .RSPBprogressBar{
        background-color: #2d2e35;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(1)::after {
      text-align: center;
      content: "Confirm Prompt";
      color: #768390;
      position: absolute;
      top: 2em;
      width: 100px;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(2)::after {
      text-align: center;
      content: "TLDR";
      color: #768390;
      position: absolute;
      top: 2em;
      width: 100px;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(3)::after {
      text-align: center;
      content: "More Content";
      color: #768390;
      position: absolute;
      top: 2em;
      width: 100px;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(4)::after {
      text-align: center;
      content: "Preview";
      color: #768390;
      position: absolute;
      top: 2em;
      width: 100px;
    }
`
const ModalHeading = styled.p`
    font-size: 26px;
    width: 'fit-content';
`

export default function SubmissionModal({ modalOpen, handleClose, selectedPrompt }) {
    const [progress, setProgress] = useState(0);
    const [barProgress, setBarProgress] = useState(progress == 0 ? 0 : 33);
    const [TLDRImage, setTLDRImage] = useState(null)
    const [TLDRText, setTLDRText] = useState('')
    const [longFormValue, setLongFormValue] = useState(null)


    const CalcHeading = () => {

        if (progress === 0) return <ModalHeading>Confirm Prompt</ModalHeading>
        if (progress === 1) return <ModalHeading>TLDR</ModalHeading>
        if (progress === 2) return <ModalHeading>More Content</ModalHeading>
        if (progress === 3) return <ModalHeading>Preview</ModalHeading>


    }

    const handleSave = async () => {
    }

    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={() => { handleClose({ type: 'standard' }) }}
            >
                <Box sx={style}>
                    <ModalWrapper>
                        <div>
                            <CalcHeading />
                            <ExitButton onClick={() => { handleClose({ type: 'standard' }) }}>exit</ExitButton>
                        </div>

                        <CheckpointWrap>
                            <ContestSubmissionCheckpointBar percent={progress * 33} />
                        </CheckpointWrap>
                        {progress === 0 && <SelectPrompt setProgress={setProgress} selectedPrompt={selectedPrompt} />}
                        {progress === 1 && <EditTLDR setProgress={setProgress} TLDRimage={TLDRImage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />}
                        {progress === 2 && <EditLongForm setProgress={setProgress} longFormValue={longFormValue} setLongFormValue={setLongFormValue} />}
                        {progress === 3 && <Preview setProgress={setProgress} TLDRImage={TLDRImage} TLDRText={TLDRText} longFormValue={longFormValue} />}

                    </ModalWrapper>

                </Box>
            </Modal>
        </div>
    );
}

const Prompt = styled.div`
    display: flex;
    flex-direction: column;
    width: ${props => props.isOpen ? '80%' : '30%'};
    justify-self: center;
    align-self: center;
    grid-gap: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    border: 2px solid black;
    border-radius: 10px;
    background-color: #22272e;
    color: #d3d3d3;
    padding: 5px;
    margin-bottom: 10px;
`
const PromptTop = styled.div`
    display: flex;
    align-items: center;

    & ${Label}{
        margin-left: 20px;
    }
`

function SelectPrompt({ setProgress, selectedPrompt }) {
    return (
        <>
            <div className='tab-message neutral'>
                <p>Limit 1 contest submission per user. If this is not the prompt you wish to create a submission for, please exit out and select a new one.</p>
            </div>
            <Prompt isOpen={true}>
                <PromptTop>
                    <h4>{selectedPrompt.title}</h4>
                    <Label color={labelColorOptions[selectedPrompt.label.color]}>{selectedPrompt.label.name}</Label>
                </PromptTop>
                <ParseBlocks data={selectedPrompt} />
                <NextButton onClick={() => { setProgress(1) }}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></NextButton>
            </Prompt>
        </>

    )
}

function EditTLDR({ setProgress, TLDRimage, setTLDRImage, TLDRText, setTLDRText }) {
    return (
        <>
            <div className='tab-message neutral'>
                <p>The TLDR section allows you to create the preview text and image that a user will see while viewing submissions. At least one of the fields (image or text) is required. Any additional content you wish to add will only be visible if a user expands your submission, which can be done in the next step.</p>
            </div>
            <TLDR TLDRimage={TLDRimage} setTLDRImage={setTLDRImage} TLDRText={TLDRText} setTLDRText={setTLDRText} />
            <PreviousButton onClick={() => { setProgress(0) }}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></PreviousButton>
            <NextButton onClick={() => { setProgress(2) }}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></NextButton>
        </>
    )
}

function EditLongForm({ setProgress, longFormValue, setLongFormValue }) {
    const ReactEditorJS = createReactEditorJS();
    const editorCore = useRef(null);


    const cleanupEditor = async () => {
        let editorData = await editorCore.current.save();
        setLongFormValue(editorData);
    }


    return (
        <>
            <div className='tab-message neutral'>
                <p>This section allows you to create longer form content that will only be visible if a user expands your submission.</p>
            </div>
            <SubmissionEdit longFormValue={longFormValue} setLongFormValue={setLongFormValue} ReactEditorJS={ReactEditorJS} editorCore={editorCore} />
            <PreviousButton onClick={async () => { await cleanupEditor(); setProgress(1) }}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></PreviousButton>
            <NextButton onClick={async () => { await cleanupEditor(); setProgress(3) }}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></NextButton>
        </>

    )
}

function Preview({ setProgress, TLDRImage, TLDRText, longFormValue }) {
    return (
        <>
            <div className='tab-message neutral'>
                <p>This is how your submission will appear to viewers. Click the expand button to see the rest of your content. You can navigate back if you need to change anything.</p>
            </div>
            <PreviewSubmission setProgress={setProgress} TLDRImage={TLDRImage} TLDRText={TLDRText} longFormValue={longFormValue} />
            <PreviousButton onClick={() => { setProgress(2) }}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></PreviousButton>
            <NextButton onClick={() => { setProgress(3) }}><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></NextButton>
        </>
    )
}

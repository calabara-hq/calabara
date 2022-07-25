import React, { useState, useEffect, useRef, useCallback } from 'react'
import { EDITOR_JS_TOOLS } from '../../../prompt_builder/editor_tools'
import { createReactEditorJS } from 'react-editor-js'
import { ParseBlocks } from '../../block-parser'
import styled, { css } from 'styled-components'
import { fade_in, submission_fade } from '../../../common/common_styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';

const SubmissionBuilderWrap = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: #22272e;
    border: none;
    border-radius: 10px;
    color: #d3d3d3;
    width: 100%;
`
const SubmissionSplit = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 30px;
    
`

const PromptButtons = styled.div`
    width: fit-content;
    margin-left: auto;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`

const SaveButton = styled.button`
    align-self: center;
    margin-left: auto;
    margin-right: 10px;
    border: 2px solid #22272e;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: lightgreen;
    color: #22272e;

    &:hover{
        color: black;
        background-color: rgba(144, 238, 144, 0.8);
    }
`
const CancelButton = styled.button`
    border: 2px solid #22272e;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: coral;
    margin-right: 10px;
    color: #22272e;
    &:hover{
        color: black;
        background-color: rgba(255, 127, 80, 0.8);
    }

    &:disabled{
        background-color: grey;
        color: darkgrey;
    }
`

export default function SubmissionBuilder({ }) {
    const [coverText, setCoverText] = useState("");
    const [coverImg, setCoverImg] = useState("");
    let [previewData, setPreviewData] = useState({ blocks: [] })

    const handleSubmit = () => {
       // setIsSubmissionBuilder(false)
    }

    const handleCancel = () => {
     //   setIsSubmissionBuilder(false)
    }


    return (
        <SubmissionBuilderWrap>
            <h3>Submission Builder</h3>
            <PromptButtons>
                <SaveButton onClick={handleSubmit}><FontAwesomeIcon icon={faCheck} /></SaveButton>
                <CancelButton onClick={handleCancel}><FontAwesomeIcon icon={faTimes} /></CancelButton>
            </PromptButtons>
            <SubmissionSplit>
                <SubmissionEdit setCoverText={setCoverText} coverImg={coverImg} setCoverImg={setCoverImg} setPreviewData={setPreviewData} />
                <PreviewEdit previewData={previewData} />
            </SubmissionSplit>

        </SubmissionBuilderWrap>
    )
}


const SubmissionEditWrap = styled.div`
    * > {
        margin-bottom: 100px;
    }

`

const SubmissionPreviewWrap = styled.div`
    display: flex;
    flex-direction: column;
`


const EditorWrap = styled.div`
    background-color: white;
    border-radius: 4px;
    min-height: 200px;
    font-size: 20px;
    text-align: left;
    padding: 10px;
    background-color: #1c2128;

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

function SubmissionEdit({ setPreviewData }) {
    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null);


    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])

    const handleChange = async () => {
        let editorData = await editorCore.current.save();
        console.log(editorData)
        setPreviewData(editorData)
    }

    return (
        <SubmissionEditWrap>
            <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Editor</h2>
            <EditorWrap>
                <ReactEditorJS value={null} onChange={handleChange} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
            </EditorWrap>
        </SubmissionEditWrap>
    )
}



const SubmissionContainer = styled.div`
    flex-grow: 0;
    //width: ${props => props.expanded ? '100%' : '30%'};
    border-radius: 10px;
    min-height: 30ch;
    font-size: 20px;
    text-align: left;
    padding: 10px;
    background-color: #1c2128;
    color: #d3d3d3;
    display: flex;
    flex-direction: column;

    img{
        display: block;
        max-width: 15em;
        margin: auto;
        border-radius: 10px;
    }
`
const SubmissionContent = styled.div`
    border-radius: 10px;
    min-height: 200px;
    max-height:  ${props => props.expanded ? 'auto' : '30ch'};;
    overflow: ${props => props.expanded ? 'visible' : 'hidden'};
    font-size: 20px;
    text-align: left;
    padding: 10px;
    background-color: #1c2128;
    color: #d3d3d3;
    position: relative;
    margin-bottom: 20px;
    //animation: ${fade_in} 0.7s ease-in-out;
    //animation: ${props => props.expanded ? css`${submission_fade} 0.7s forwards` : ''};


    img{
        display: block;
       // max-width: ${props => props.expanded ? 'none' : '15em'};
        margin: auto;
        border-radius: 10px;
        margin-bottom: 10px;
    }
`


const SubmissionWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    //grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
    margin-bottom: 400px;
`
const DropdownButton = styled.button`
    margin-top: auto;
    width: 100%;
    justify-self: center;
    align-self: center;
    color: grey;
    font-size: 16px;
    background-color: transparent;
    border: none;
    border-radius: 10px;
    padding: 10px 0px;
    &:hover{
        background-color: #33373d;
    }
`

const PreviewHelpMsg = styled.div`
    background-color: rgba(169, 152, 255, 0.05);
    color: rgb(169, 152, 255);
    padding: 10px;
    border-radius: 10px;

    p{
        margin: 0;
        font-size: 16px;
    }
`



function PreviewEdit({ previewData }) {
    const [expanded, setExpanded] = useState(false);
    const handleExpand = () => {
        if (expanded) return setExpanded(false)
        setExpanded(true)
    }

    return (
        <SubmissionPreviewWrap>
            <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Preview</h2>
            <SubmissionContainer expanded={expanded}>
                <SubmissionContent expanded={expanded}>
                    {Object.keys(previewData).length > 0 && <ParseBlocks data={previewData} />}
                </SubmissionContent>
                <DropdownButton onClick={handleExpand}><FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} /></DropdownButton>
            </SubmissionContainer>

            {/*<PreviewHelpMsg>
                <p>Content here is collapsed to show how it would be displayed on the main submission page. Without expanding, this is what would be visible.</p>
    </PreviewHelpMsg>*/}
        </SubmissionPreviewWrap>
    )
}
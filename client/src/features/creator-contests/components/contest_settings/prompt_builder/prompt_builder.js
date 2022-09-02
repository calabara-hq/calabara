import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import Editor from 'react-medium-editor';
import { EDITOR_JS_TOOLS } from './editor_tools';
import { createReactEditorJS } from 'react-editor-js';
import styled from 'styled-components';
import { Contest_h2, Contest_h3 } from '../../common/common_styles';
import usePromptBuilder from '../../../../hooks/usePromptBuilder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPalette, faQuestionCircle, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fade_in, Label, labelColorOptions } from '../../common/common_styles';




function reducer(state, action) {
    switch (action.type) {
        case 'update_single':
            return { ...state, ...action.payload };
        case 'update_all':
            return { ...action.payload }
        default:
            throw new Error();
    }
}

const PromptsWrap = styled.div`
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

const PromptBuilderMainHeading = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
`

const ExistingPromptContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    //margin: 20px auto;
`
const NewPromptButton = styled.button`
    font-size: 16px;
    font-weight: 550;
    color: rgb(6, 214, 160);
    background-color: rgb(6, 214, 160, .3);
    border: 2px solid transparent;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 10px;
    margin-left: auto;
    transition: background-color 0.2s ease-in-out;
    transition: color 0.3s ease-in-out;


    &:hover{
        background-color: rgb(6, 214, 160);
        color: #fff;
    }
`

const PromptStyle = styled.div`
    margin: 5px;
    display: flex;
    flex-direction: column;
    width: 30%;
    justify-content: space-evenly;
    align-items: center;
    grid-gap: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    border: 2px solid #4d4d4d;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);

    border-radius: 4px;
    background-color: #262626;
    color: #d3d3d3;
    padding: 5px;
    cursor: pointer;
`
const PromptBuilderWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    animation: ${fade_in} 0.7s forwards;
    display: ${props => !props.visibile ? 'none' : ''};
    
`

const PromptDataWrap = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
`


const EditorWrap = styled.div`
    flex: 1 1 72%;
    border: 2px solid #4d4d4d;    
    border-radius: 4px;
    height: 500px;
    max-height: 600px;
    overflow-y: scroll;
    font-size: 20px;
    width: 100%;
    text-align: left;
    padding: 10px;
    color: #d3d3d3;
    background-color: #262626;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);



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


const PromptSidebarWrap = styled.div`
    flex: 1 1 15%;
    display: flex;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 5px;
    align-self: flex-start;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);

`

const PromptTop = styled.div`
    display: flex;
    align-items: center;
`

const PromptHeadingInput = styled.div`
    margin-bottom: 20px;
`

const PromptInput = styled.input`
    font-weight: 550;
    color: #d3d3d3;
    background-color: #121212;
    border: 2px solid ${props => props.error ? "red" : '#d95169'};
    border-radius: 4px;
    outline: none;
    padding: 5px 10px;
    text-align: center;

`
const PromptInputError = styled.div`
    margin-top: 5px;
    color: red;
`


const PromptButtons = styled.div`
    width: fit-content;
    margin-left: auto;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
`

const SaveButton = styled.button`
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
        background-color: #1e1e1e;
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

const DeleteButton = styled.button`
    border: 2px solid #22272e;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: coral;

    &:hover{
        color: black;
        background-color: rgba(255, 127, 80, 0.8);
        &::before{
            content: "delete";
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

    &:disabled{
        background-color: grey;
        color: darkgrey;
    }
`

const SidebarList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    `

const ListRowTitle = styled.p`
    font-size: 18px;
    color: #d3d3d3;
    margin: 0;

    `
const ListRowButton = styled.button`
    border: none;
    margin-left: auto;
    background-color: transparent;
    color: #d3d3d3;
    `


const ListRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    cursor: pointer;

    &:hover ${ListRowTitle}{
        color: #539bf5;
    }
    &:hover ${ListRowButton}{
        color: #539bf5;
    }
    &:hover{
        &::after{
                content: "Labels help users identify and filter submission types";
                position: absolute;
                border: none;
                background-color: #4d4d4d;
                padding: 3px;
                border-radius: 4px;
                top: 0;
                color: #d9d9d9;
                transform: translate(0%, -120%);
                animation: ${fade_in} 0.5s ease-in-out;

            }
    }
    `

const LabelConfig = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: flex-start;
    grid-gap: 20px;
    width: 90%;
    margin: 20px auto;
    cursor: pointer;
    `

const ColorSelectorWrap = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    `

const Color = styled.button`
    flex: 0 1 0;
    min-width: 30px;
    min-height: 30px;
    background-color: ${props => props.color};
    border: 2px solid ${props => props.color === 'transparent' ? 'grey' : 'transparent'};
    border-radius: 100px;
    `






// allow user to create prompts for a contest
export default function PromptBuilder({ }) {
    const {
        promptData,
        setPromptData,
        handleHeadingChange,
        handleSwitchPrompts,
        handleLabelChange,
        handleLabelColorChange,
        handleHeadingError,
        handleLabelError,
        handleDeletePrompt,
        handleEmptyContentError,
    } = usePromptBuilder();

    let { selected_prompt, prompt_heading, prompt_heading_error, prompt_label, prompt_label_error, prompt_label_color, prompt_blocks, prompt_content_error} = promptData

    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null);

    const labelInputRef = useRef(null);


    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])

    useEffect(() => {
        console.log(prompt_content_error)
    },[prompt_content_error])

    const handleSubmit = async () => {

        // error check 

        // empty prompt heading
        if (!prompt_heading) return handleHeadingError();

        // empty prompt label
        if (!prompt_label) {
            
            handleLabelError();
            labelInputRef.current.scrollIntoView({behavior: 'smooth', scrollMode: 'if-needed', block: 'center'});
            return;
        }
        let editorData = await editorCore.current.save();
        if(editorData.blocks.length === 0) return handleEmptyContentError();


        // stuff editorData with additional prompt config data

        editorData.title = prompt_heading;
        editorData.label = {
            name: prompt_label,
            color: prompt_label_color
        };


        if (promptData.selected_prompt === -1) {
            setPromptData({ type: "PUSH_BLOCK", payload: editorData })
        }
        else {
            setPromptData({ type: "UPDATE_BLOCK", payload: editorData })
        }
        setPromptData({ type: "SET_SELECTED_PROMPT", payload: -2 })

    }

    const handleDelete = () => {
        handleDeletePrompt();
    }

    const handleCancel = () => {
        setPromptData({ type: "SET_SELECTED_PROMPT", payload: -2 })
    }

    const handleNewPrompt = async () => {
        setPromptData({ type: "NEW_PROMPT" })
        await editorCore.current.clear();
    }

    const clearEmptyContentError = () => {
        console.log(prompt_content_error)
        if(prompt_content_error) return setPromptData({type: "CLEAR_PROMPT_CONTENT_ERROR"})
    }

    return (
        <PromptsWrap title="Prompt Builder">
            <PromptBuilderMainHeading>
                <NewPromptButton onClick={handleNewPrompt}>new prompt</NewPromptButton>
            </PromptBuilderMainHeading>
            <ExistingPromptContainer>
                {prompt_blocks.map((el, index) => { return <Prompt el={el} index={index} handleSwitchPrompts={handleSwitchPrompts} /> })}
            </ExistingPromptContainer>
            <PromptBuilderWrap visibile={selected_prompt > -2}>
                <PromptTop>
                    <PromptHeadingInput>
                        <PromptInput error={prompt_heading_error} value={prompt_heading} onChange={handleHeadingChange} placeholder='Prompt Heading'></PromptInput>
                        {prompt_heading_error && <PromptInputError>Please provide a prompt heading</PromptInputError>}
                    </PromptHeadingInput>
                    <PromptButtons>
                        <SaveButton onClick={handleSubmit}><FontAwesomeIcon icon={faCheck} /></SaveButton>
                        <CancelButton onClick={handleCancel}><FontAwesomeIcon icon={faTimes} /></CancelButton>
                        <DeleteButton disabled onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /></DeleteButton>
                    </PromptButtons>
                </PromptTop>
                {prompt_content_error && <PromptInputError>Prompt body cannot be empty</PromptInputError>}
                <PromptDataWrap>
                    <EditorWrap onKeyDown={clearEmptyContentError}>
                        <ReactEditorJS value={prompt_blocks[selected_prompt] || null} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
                    </EditorWrap>
                    <PromptSidebarWrap >
                        <PromptSidebar labelInputRef={labelInputRef} error={prompt_label_error} promptLabel={prompt_label} handleLabelChange={handleLabelChange} promptLabelColor={prompt_label_color} handleLabelColorChange={handleLabelColorChange} />
                    </PromptSidebarWrap>
                </PromptDataWrap>
            </PromptBuilderWrap>


        </PromptsWrap>
    )

}

function Prompt({ el, index, handleSwitchPrompts }) {


    let displayTitle = el.title.length > 30 ? el.title.substring(0, 30) + ' ...' : el.title;


    return (
        <PromptStyle onClick={() => { handleSwitchPrompts(index) }}>
            <h4>{displayTitle}</h4>
            <Label color={labelColorOptions[el.label.color]}>{el.label.name}</Label>
        </PromptStyle>
    )
}


function PromptSidebar({ labelInputRef, error, promptLabel, handleLabelChange, promptLabelColor, handleLabelColorChange }) {


    return (
        <SidebarList >
            <ListRow>
                <ListRowTitle>label</ListRowTitle>
                <ListRowButton><FontAwesomeIcon style={{ fontSize: '20px' }} icon={faQuestionCircle} /></ListRowButton>
            </ListRow>

            <LabelConfig ref={labelInputRef} error={error}>
                <PromptInput error = {error} style={{ width: '95%' }} placeholder="e.g. art" value={promptLabel} onChange={handleLabelChange} />
                {error && <PromptInputError>Please provide a prompt label</PromptInputError>}
                <ColorSelector promptLabelColor={promptLabelColor} handleLabelColorChange={handleLabelColorChange} />
            </LabelConfig>

        </SidebarList>
    )
}

function ColorSelector({ promptLabelColor, handleLabelColorChange }) {

    useEffect(() => { console.log(promptLabelColor) }, [promptLabelColor])

    return (
        <ColorSelectorWrap>
            <FontAwesomeIcon style={{ minHeight: '30px', minWidth: '30px', color: 'grey', cursor: 'default' }} icon={faPalette} />
            {labelColorOptions.map((color, index) => {
                return (
                    <Color key={index} color={color.text} onClick={() => { handleLabelColorChange(index) }}>
                        {promptLabelColor === index && <FontAwesomeIcon icon={faCheck} style={{ color: 'white' }} />}
                    </Color>
                )
            })}
        </ColorSelectorWrap>
    )
}
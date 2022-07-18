import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react'
import Editor from 'react-medium-editor';
import { EDITOR_JS_TOOLS } from './editor_tools';
import { createReactEditorJS } from 'react-editor-js'
import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../common/common_styles'
import usePromptBuilder from '../../../hooks/usePromptBuilder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPalette, faQuestionCircle, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fade_in, Label, labelColorOptions } from '../common/common_styles';




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
    background-color: #22272e;
    border: 2px solid #444c56;
    border-radius: 4px;
    padding: 10px;
    width: 70%;

    > * {
        margin-bottom: 30px;
    }
`

const PromptBuilderMainHeading = styled.div`
    display: flex;
`

const ExistingPromptContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    margin: 20px auto;
`
const NewPromptButton = styled.button`
    background-color: lightgreen;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 16px;
    margin-left: auto;
    color: black;
    &:hover{
        background-color: rgba(144, 238, 144, 0.8);
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
    border: 2px solid black;
    border-radius: 4px;
    background-color: #1c2128;
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
    background-color: white;
    border-radius: 4px;
    height: 500px;
    max-height: 600px;
    overflow-y: scroll;
    font-size: 20px;
    width: 100%;
    text-align: left;
    padding: 10px;
    color: #d3d3d3;
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


const PromptSidebarWrap = styled.div`
    flex: 1 1 25%;
    display: flex;
    border: 1px solid #444c56;
    border-radius: 4px;
    padding: 5px;
    align-self: flex-start;
`

const PromptTop = styled.div`
    display: flex;
    align-items: center;
`

const PromptHeadingInput = styled.div`
    margin-bottom: 20px;
`

const PromptInput = styled.input`
    border: 2px solid ${props => props.error ? "red" : '#444c56'};
    border-radius: 4px;
    background-color: transparent;
    outline: none;
    padding: 5px 10px;
    color: #d3d3d3;
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
    background-color: lightgreen;
    color: black;

    &:hover{
        color: black;
        background-color: rgba(144, 238, 144, 0.8);
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
                background-color: #444c56;
                padding: 3px;
                border-radius: 4px;
                top: 0;
                color: lightgrey;
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
    } = usePromptBuilder();

    let { selected_prompt, prompt_heading, prompt_heading_error, prompt_label, prompt_label_error, prompt_label_color, prompt_blocks } = promptData

    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null);

    const labelInputRef = useRef(null);


    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])


    const handleSubmit = async () => {

        // error check 

        // empty prompt heading
        if (!prompt_heading) return handleHeadingError();

        // empty prompt label
        if (!prompt_label) {
            
            handleLabelError();
            labelInputRef.current.scrollIntoView({behavior: 'smooth'});
            return;
        }

        let editorData = await editorCore.current.save();


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

    return (
        <PromptsWrap>
            <PromptBuilderMainHeading>
                <Contest_h2 grid_area={"prompt_builder"}>Prompt Builder</Contest_h2>
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
                <PromptDataWrap>
                    <EditorWrap>
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
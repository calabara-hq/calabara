import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react'
import Editor from 'react-medium-editor';
import { EDITOR_JS_TOOLS } from './editor_tools';
import { createReactEditorJS } from 'react-editor-js'
import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../common/common_styles'
import usePromptBuilder from '../../../hooks/usePromptBuilder';

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
    grid-gap: 30px;
`

const PromptBuilderMainHeading = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 33%);
    grid-template-areas: "prompt_builder . .";
`

const AddPromptsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    width: 80%;
`

const PromptStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    grid-gap: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    border: none;
    border-radius: 4px;
    background-color: #1c2128;
    padding: 5px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);

`
const EditorWrap = styled.div`
    background-color: white;
    width: 70%;
    margin: 0 auto;
    border-radius: 4px;
    min-height: 200px;
    font-size: 20px;
    display: ${props => !props.visibile ? 'none' : ''};
`


//let editorContent = null;

// allow user to create prompts for a contest
export default function PromptBuilder({ }) {
    const [prompts, setPrompts] = useState([])
    const { promptData, setPromptData } = usePromptBuilder();
    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null);
    const [editorOpenIndex, setEditorOpenIndex] = useState(-1);

    useEffect(() => {
        console.log(promptData)
    },[promptData])


    const handleInitialize = useCallback(async (instance) => {
        console.log('re initializing')
        editorCore.current = instance;
    }, [])


    const handleSubmit = async () => {
        const editorData = await editorCore.current.save();
        if (promptData.selected_prompt === -1) {
            setPromptData({ type: "PUSH_BLOCK", payload: editorData })
        }
        else {
            setPromptData({ type: "UPDATE_BLOCK", payload: editorData })
        }
        setPromptData({ type: "SET_SELECTED_PROMPT", payload: -2 })

    }



    return (
        <PromptsWrap>
            <PromptBuilderMainHeading>
                <Contest_h2 grid_area={"prompt_builder"}>Prompt Builder</Contest_h2>
            </PromptBuilderMainHeading>
            <AddPromptsContainer>
                {promptData.prompt_blocks.map((el, index) => { return <Prompt el={el} index={index} setPromptData={setPromptData} /> })}
                <button onClick={() => { setPromptData({ type: "SET_SELECTED_PROMPT", payload: -1 }) }}>new prompt</button>
            </AddPromptsContainer>
            <EditorWrap visibile={promptData.selected_prompt > -2}>
                <button onClick={handleSubmit}>save</button>
                <ReactEditorJS value={promptData.prompt_blocks[promptData.selected_prompt] || null} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
            </EditorWrap>
        </PromptsWrap>
    )

}

function Prompt({ el, index, setPromptData }) {
    console.log(index)
    return (
        <PromptStyle onClick={() => { console.log(index); setPromptData({ type: "SET_SELECTED_PROMPT", payload: index }) }}>
            <p>{index}</p>
        </PromptStyle>
    )
}



function PromptEditor({ }) {
    const { promptData, setPromptData } = usePromptBuilder();
    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null);

    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])


    const handleSubmit = async () => {
        const editorData = await editorCore.current.save();
        if (!promptData.selected_prompt) {
            setPromptData({ type: "PUSH_BLOCK", payload: editorData })

        }
        else {
            //prompts_copy[index] = editorData
        }
    }
    /*

    const handleCancel = async () => {
        setEditorOpenIndex(-1);
    }
    */

    const EditorWrap = styled.div`
        background-color: white;
        width: 70%;
        margin: 0 auto;
        border-radius: 4px;
        min-height: 200px;
        font-size: 20px;
    `

    return (
        <EditorWrap>
            <button onClick={handleSubmit}>save</button>
            <ReactEditorJS defaultValue={promptData.prompt_blocks[promptData.selected_prompt] || null} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
        </EditorWrap>


    )
}

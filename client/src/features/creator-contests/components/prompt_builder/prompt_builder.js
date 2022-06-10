import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react'
import Editor from 'react-medium-editor';
import { EDITOR_JS_TOOLS } from './editor_tools';
import { createReactEditorJS } from 'react-editor-js'
import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../common/common_styles'


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
    grid-template-columns: repeat(3, 1fr);
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

// allow user to create prompts for a contest
export default function PromptBuilder({ }) {
    const [prompts, setPrompts] = useReducer(reducer, ['test', 'test', 'test'])

    return (
        <PromptsWrap>
            <PromptBuilderMainHeading>
                <Contest_h2 grid_area={"prompt_builder"}>Prompt Builder</Contest_h2>
            </PromptBuilderMainHeading>
            <AddPromptsContainer>
                {prompts.map((el, index) => { return <Prompt el={el} /> })}
            </AddPromptsContainer>
            <PromptEditor />
        </PromptsWrap>
    )

}

function Prompt({ el }) {

    return (
        <PromptStyle>
            <p>{el}</p>
        </PromptStyle>
    )
}



function PromptEditor({ }) {
    // const [filedata, setFileData] = useState([]);
    const contentRef = useRef(null);

    let content = ""

    function updateContent(newContent) {
        content = newContent;
    }

    function handleKeyDown(e) {
        if (e.key === "Tab") {
            e.preventDefault();
        }
    }

    const handleInitialize = useCallback((instance) => {


    })

    const handleSubmit = () => {
        console.log(contentRef)
    }

    const EditorWrap = styled.div`
        background-color: white;
        width: 70%;
        margin: 0 auto;
        border-radius: 4px;
        min-height: 200px;
        font-size: 20px;
    `

    const ReactEdtorJS = createReactEditorJS();
    return (
        <EditorWrap>
            <button style={{ marginLeft: 'auto' }}>cancel</button>
            <button onClick={handleSubmit}>submit</button>
            <ReactEdtorJS ref={contentRef} tools={EDITOR_JS_TOOLS} />
        </EditorWrap>


    )
}

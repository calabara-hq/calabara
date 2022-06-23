import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react'
import Editor from 'react-medium-editor';
import { EDITOR_JS_TOOLS } from './editor_tools';
import { createReactEditorJS } from 'react-editor-js'
import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../common/common_styles'
import usePromptBuilder from '../../../hooks/usePromptBuilder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCheck, faCog, faPalette, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fade_in } from '../common/common_styles';




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
    cursor: pointer;
`
const PromptBuilderWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 0 auto;
    animation: ${fade_in} 0.7s forwards;
    display: ${props => !props.visibile ? 'none' : ''};
`

const PromptDataWrap = styled.div`
    display: flex;
    width: 100%;
`


const EditorWrap = styled.div`
    background-color: white;
    width: 80%;
    border-radius: 4px;
    min-height: 200px;
    font-size: 20px;
`


const PromptSidebarWrap = styled.div`
    width: 20%;
    display: flex;
    border: 1px solid grey;
    border-radius: 4px;
    margin-left: 20px;
`

const PromptHeadingInput = styled.div`

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
    border: none;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: lightgreen;
`

const CancelButton = styled.button`
    border: none;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: coral;
`



// allow user to create prompts for a contest
export default function PromptBuilder({ }) {
    const { promptData, setPromptData } = usePromptBuilder();
    const [promptHeading, setPromptHeading] = useState(promptData.prompt_blocks[promptData.selected_prompt]?.title || null)
    const [promptLabel, setPromptLabel] = useState(promptData.prompt_blocks[promptData.selected_prompt]?.label.name || "")
    const [promptLabelColor, setPromptLabelColor] = useState(0 || promptData.prompt_blocks[promptData.selected_prompt]?.label.color)

    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null);


    useEffect(() => {
        console.log(promptData)
    }, [promptData])

    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])


    const handleSubmit = async () => {
        let editorData = await editorCore.current.save();
        console.log(editorData)

        // stuff editorData with additional config data

        editorData.title = promptHeading;
        editorData.label = {
            name: promptLabel,
            color: promptLabelColor
        };


        if (promptData.selected_prompt === -1) {
            setPromptData({ type: "PUSH_BLOCK", payload: editorData })
        }
        else {
            setPromptData({ type: "UPDATE_BLOCK", payload: editorData })
        }
        setPromptData({ type: "SET_SELECTED_PROMPT", payload: -2 })

    }

    const handleHeadingChange = (e) => {
        setPromptHeading(e.target.value)
    }


    const handleNewPrompt = () => {
        setPromptData({ type: "SET_SELECTED_PROMPT", payload: -1 })
    }

    const handleLabelChange = (e) => {
        setPromptLabel(e.target.value)
    }

    return (
        <PromptsWrap>
            <PromptBuilderMainHeading>
                <Contest_h2 grid_area={"prompt_builder"}>Prompt Builder</Contest_h2>
            </PromptBuilderMainHeading>
            <AddPromptsContainer>
                {promptData.prompt_blocks.map((el, index) => { return <Prompt el={el} index={index} setPromptData={setPromptData} /> })}
                <button onClick={handleNewPrompt}>new prompt</button>
            </AddPromptsContainer>
            <PromptBuilderWrap visibile={promptData.selected_prompt > -2}>
                <PromptButtons>
                    <SaveButton onClick={handleSubmit}><FontAwesomeIcon icon={faCheck} /></SaveButton>
                    <CancelButton onClick={handleSubmit}><FontAwesomeIcon icon={faTimes} /></CancelButton>
                </PromptButtons>
                <PromptHeadingInput>
                    <input value={promptHeading} onChange={handleHeadingChange} placeholder='Prompt Heading'></input>
                </PromptHeadingInput>
                <PromptDataWrap>
                    <EditorWrap>
                        <ReactEditorJS value={promptData.prompt_blocks[promptData.selected_prompt] || null} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
                    </EditorWrap>
                    <PromptSidebarWrap>
                        <PromptSidebar handleLabelChange={handleLabelChange} promptLableColor={promptLabelColor} setPromptLabelColor={setPromptLabelColor}/>
                    </PromptSidebarWrap>
                </PromptDataWrap>
            </PromptBuilderWrap>
        </PromptsWrap>
    )

}

function Prompt({ el, index, setPromptData }) {
    return (
        <PromptStyle onClick={() => { console.log(index); setPromptData({ type: "SET_SELECTED_PROMPT", payload: index }) }}>
            <p>{index}</p>
        </PromptStyle>
    )
}


function PromptSidebar({handleLabelChange, promptLabelColor, setPromptLabelColor}) {

    const [modalOpen, setModalOpen] = useState(false)

    console.log(promptLabelColor)
    
    const SidebarList = styled.div`
        display: flex;
        flex-direction: column;
        width: 100%;
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
    console.log('re render')

    return (
        <SidebarList>
            <ListRow onClick={() => { setModalOpen(true) }}>
                <ListRowTitle>label</ListRowTitle>
                <ListRowButton><FontAwesomeIcon icon={faCog} /></ListRowButton>
            </ListRow>
            {modalOpen &&
                <LabelConfig>
                    <input onChange={handleLabelChange}/>
                    <ColorSelector promptLabelColor={promptLabelColor} setPromptLabelColor={setPromptLabelColor}/>
                </LabelConfig>
            }

        </SidebarList>
    )
}

function ColorSelector({promptLabelColor, setPromptLabelColor }) {


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

    const options = [
        { hex: 'transparent' },
        { hex: 'red' },
        { hex: 'blue' },
        { hex: 'green' },
        { hex: 'orange' },

    ]
    console.log(promptLabelColor)

    return (
        <ColorSelectorWrap>
        <FontAwesomeIcon style={{minHeight: '30px', minWidth: '30px', color: 'grey', cursor: 'default'}} icon={faPalette}/>
            {options.map((color, index) => {
                return (
                    <Color color={color.hex} selected={promptLabelColor === index} onClick={() => {setPromptLabelColor(index)}}>
                        {promptLabelColor === index && <FontAwesomeIcon icon={faCheck} style={{color: 'white'}}/>}
                    </Color>
                )
            })}
        </ColorSelectorWrap>
    )
}
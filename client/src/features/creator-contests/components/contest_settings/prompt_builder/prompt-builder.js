import styled from 'styled-components'
import { EDITOR_JS_TOOLS } from '../../common/editor_tools';
import { createReactEditorJS } from 'react-editor-js';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fade_in, labelColorOptions } from '../../common/common_styles';
import { faQuestionCircle, faPalette, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

const CreatePromptWrap = styled.div`
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
const PromptBuilderWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    
`

const PromptDataWrap = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
`


const PromptTop = styled.div`
    display: flex;
    align-items: center;
`


const PromptHeadingInput = styled.div`
    margin-bottom: 20px;
    width: 50%;
`

const PromptInput = styled.input`
    font-weight: 550;
    color: #d3d3d3;
    background-color: #121212;
    border: 2px solid ${props => props.error ? "rgba(254, 72, 73, 1)" : 'rgb(83, 155, 245)'};
    border-radius: 4px;
    outline: none;
    padding: 5px 10px;
    text-align: center;

`
const PromptInputError = styled.div`
    margin-top: 5px;
    color: rgba(254, 72, 73, 1);
`


const EditorWrap = styled.div`
    flex: 1 1 72%;
    border: 2px solid #4d4d4d;    
    border-radius: 4px;
    min-height: 500px;
    //max-height: 600px;
    //overflow-y: scroll;
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
    flex-direction: column;
    align-self: flex-start;

`


const SidebarList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 5px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    margin-bottom: 20px;
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
                content: "Labels help users identify and filter contest types";
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


const CoverImgUploader = styled.div`
    width: 100%;
    margin-bottom: 20px;
    img{
    display: inline;
    max-width: 13em;
    max-height: 13em;
    border-radius: 10px;
}
`


const ImageUploadBtn = styled.button`
  width: 100%;
  height: 200px;
  padding: 3px;
  border: double 2px transparent;
        border-radius: 10px;
        background-image: linear-gradient(#262626, #262626), 
                        linear-gradient(to right, #e00f8e, #2d66dc);
        background-origin: border-box;
        background-clip: padding-box, border-box;

        box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
`

const RemoveImageButton = styled.button`
    position: absolute;
    transform: translate(-50%, -50%);
    border: 2px solid #22272e;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: #e5534b;
`

export default function PromptBuilder({ promptBuilderData, setPromptBuilderData, promptEditorCore }) {
    const ReactEditorJS = createReactEditorJS()
    const labelInputRef = useRef(null);
    const imageUploader = useRef(null);
    const {
        prompt_heading,
        prompt_heading_error,
        prompt_label,
        prompt_label_error,
        prompt_label_color,
        prompt_cover_image,
        prompt_content_error
    } = promptBuilderData

    const handleInitialize = useCallback((instance) => {
        promptEditorCore.current = instance;
    }, [])


    const handleHeadingChange = (e) => {
        setPromptBuilderData({ type: "update_single", payload: { prompt_heading: e.target.value, prompt_heading_error: false } })
    }


    const handleLabelChange = (e) => {
        setPromptBuilderData({ type: "update_single", payload: { prompt_label: e.target.value, prompt_label_error: false } })
    }

    const handleLabelColorChange = (color) => {
        setPromptBuilderData({ type: "update_single", payload: { prompt_label_color: color } })
    }

    const handleImageUpload = (e) => {
        if (e.target.files.length === 0) return
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
            url: null
        }
        const formData = new FormData();
        formData.append(
            "image",
            img.data
        )

        axios({
            method: 'post',
            url: '/creator_contests/upload_img',
            data: formData
        }).then((response) => {
            img.url = response.data.file.url;
            setPromptBuilderData({ type: "update_single", payload: { prompt_cover_image: img } })
        })
    }

    const removeCoverImage = () => {
        setPromptBuilderData({ type: "update_single", payload: { prompt_cover_image: null } })
        imageUploader.current.value = null;
    }

    const clearEditorErrors = () => {
        if (promptBuilderData.prompt_content_error) return setPromptBuilderData({ type: "update_single", payload: { prompt_content_error: false } })
    }


    return (
        <CreatePromptWrap title="Prompt Builder">
            <PromptBuilderWrap>
                <PromptTop>
                    <PromptHeadingInput>
                        <PromptInput error={prompt_heading_error} value={prompt_heading} onChange={handleHeadingChange} placeholder='Title' maxLength={50} style={{ width: '100%' }}></PromptInput>
                        {prompt_heading_error && <PromptInputError>Please provide a prompt title</PromptInputError>}
                    </PromptHeadingInput>
                </PromptTop>
                {prompt_content_error && <PromptInputError>Prompt body cannot be empty</PromptInputError>}
                <PromptDataWrap>
                    <EditorWrap onClick={clearEditorErrors}>
                        <ReactEditorJS value={null} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
                    </EditorWrap>
                    <PromptSidebarWrap >
                        <CoverImgUploader>
                            <input placeholder="Logo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} ref={imageUploader} />
                            <ImageUploadBtn type="button" onClick={() => imageUploader.current.click()}>
                                <div>
                                    {prompt_cover_image && <img src={prompt_cover_image.preview} />}
                                    {!prompt_cover_image && <p style={{ color: '#d3d3d3' }}>Cover Image</p>}
                                </div>
                            </ImageUploadBtn>
                            {prompt_cover_image && <RemoveImageButton onClick={removeCoverImage}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></RemoveImageButton>}
                        </CoverImgUploader>
                        <PromptSidebar labelInputRef={labelInputRef} error={prompt_label_error} promptLabel={prompt_label} handleLabelChange={handleLabelChange} promptLabelColor={prompt_label_color} handleLabelColorChange={handleLabelColorChange} />
                    </PromptSidebarWrap>
                </PromptDataWrap>
            </PromptBuilderWrap>

        </CreatePromptWrap>
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
                <PromptInput error={error} style={{ width: '95%' }} maxLength={15} placeholder="e.g. art" value={promptLabel} onChange={handleLabelChange} />
                {error && <PromptInputError>Please provide a prompt label</PromptInputError>}
                <ColorSelector promptLabelColor={promptLabelColor} handleLabelColorChange={handleLabelColorChange} />
            </LabelConfig>

        </SidebarList>
    )
}

function ColorSelector({ promptLabelColor, handleLabelColorChange }) {


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
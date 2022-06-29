import React, { useState, useEffect, useRef, useCallback } from 'react'
import { EDITOR_JS_TOOLS } from '../prompt_builder/editor_tools'
import { createReactEditorJS } from 'react-editor-js'
import { ParseBlocks } from './block-parser'
import styled from 'styled-components'
import editor from 'react-medium-editor/dist/editor'

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

export default function SubmissionBuilder({ }) {
    const [coverText, setCoverText] = useState("");
    const [coverImg, setCoverImg] = useState("");
    let [previewData, setPreviewData] = useState({blocks: []})
    return (
        <SubmissionBuilderWrap>
            <h3>Submission Builder</h3>
            <SubmissionSplit>
                <SubmissionEdit setCoverText={setCoverText} coverImg={coverImg} setCoverImg={setCoverImg} setPreviewData={setPreviewData} />
                <PreviewEdit previewData={previewData} />
            </SubmissionSplit>

        </SubmissionBuilderWrap>
    )
}


function b64toBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
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


/*

const CoverTextInput = styled.input`
    outline: none;
    border: 2px solid #444c56;
    border-radius: 4px;
    background-color: #1c2128;

`

const CoverImgWrapper = styled.div`
    img[src]{
        display: inline;
        z-index: -100;
        max-width: 9rem;
        max-height: 9rem;
        border-radius: 100px;
    }
`

const CoverImgUploadBtn = styled.button`
    margin-bottom: 10px;
    min-width: 15rem;
    min-height: 15rem;
    height: 6rem;
    border: 2px solid #444c56;
    border-radius: 4px;
    padding: 3px;
    background-color: #1c2128;
`
*/

const EditorWrap = styled.div`
    background-color: white;
    border-radius: 4px;
    min-height: 200px;
    font-size: 20px;
    text-align: left;
    padding: 10px;
    background-color: #1c2128;
`

function SubmissionEdit({ setCoverText, coverImg, setCoverImg, setPreviewData }) {
    const imageUploader = useRef(null);
    const ReactEditorJS = createReactEditorJS()
    const editorCore = useRef(null);
    const [loop, setLoop] = useState(false);


    const handleImageUpload = e => {
        const [file] = e.target.files;
        if (file) {

            const reader = new FileReader();
            reader.onload = (e) => {

                const blob = b64toBlob(e.target.result);
                const blobUrl = URL.createObjectURL(blob);

                setCoverImg(blobUrl)
            }

            reader.readAsDataURL(file);
        }
    }

    const handleSaveTemp = async () => {
        let editorData = await editorCore.current.save();
        console.log(editorData)
    }

    const handleCoverTxtChange = e => {
        setCoverText(e.target.value)
    }

    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
        await editorCore.current.isReady;
        setLoop(true)
        console.log(editorCore)
    }, [])



    useEffect(() => {
        (async () => {
            if (loop) {

                let interval = setInterval(async () => {
                    let editorData = await editorCore.current.save();
                    setPreviewData(editorData)
                }, 3000)
                return () => clearInterval(interval);

            }
        })();
    }, [loop])


    return (
        <SubmissionEditWrap>
            <h2>Editor</h2>
            <EditorWrap>
                <ReactEditorJS value={null} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
            </EditorWrap>

            {/*
            <CoverTextInput placeholder='cover text'></CoverTextInput>
            <CoverImgWrapper>
                <input placeholder="cover image" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} ref={imageUploader} />
                <CoverImgUploadBtn type="button" onClick={() => imageUploader.current.click()}>
                    <div>
                        {!coverImg && 'cover image'}
                        <img src={coverImg} />
                    </div>
                </CoverImgUploadBtn>
            </CoverImgWrapper>
            */}

        </SubmissionEditWrap>
    )
}


function PreviewEdit({ previewData }) {
    console.log(previewData)
    const editorCore = useRef(null);
    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])
    return (
        <SubmissionPreviewWrap>
            <h2>Preview</h2>
            <EditorWrap>
                {Object.keys(previewData).length > 0 && <ParseBlocks blocks={previewData} />}
            </EditorWrap>
        </SubmissionPreviewWrap>
    )
}
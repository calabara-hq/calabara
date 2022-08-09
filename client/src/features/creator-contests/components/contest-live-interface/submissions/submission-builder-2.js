import React, { useState, useEffect, useRef, useCallback } from 'react'
import { EDITOR_JS_TOOLS } from '../../contest_settings/prompt_builder/editor_tools'
import { ParseBlocks } from '../block-parser'
import styled, { css } from 'styled-components'
import { fade_in, submission_fade } from '../../common/common_styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';
import { grey } from '@mui/material/colors'




const EditorWrap = styled.div`
    background-color: white;
    border-radius: 4px;
    font-size: 18px;
    text-align: left;
    padding: 10px;
    background-color: #22272e;
    max-height: 45vh;
    width: 80%;
    margin: 0 auto;
    overflow-y: scroll;

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

export default function SubmissionEdit({ ReactEditorJS, editorCore, longFormValue, setLongFormValue }) {

    const handleInitialize = useCallback(async (instance) => {
        editorCore.current = instance;
    }, [])



    return (
        <EditorWrap>
            <ReactEditorJS defaultValue={longFormValue} ref={editorCore} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
        </EditorWrap>
    )
}

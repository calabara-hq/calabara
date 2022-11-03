import styled, { css } from 'styled-components'
import { fade_in, fade_out } from '../../../common/common_styles'

export const CreateSubmissionContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    align-items: stretch;
    padding: 10px;
    border: none;
    border-radius: 10px;
    height: none;
    animation: ${props => (props.isSaving ? css`${fade_out} 0.3s forwards` : '')};
    > * {
        margin-bottom: 15px;
        margin-top: 15px;
    }
`

export const SavingSubmissionDiv = styled.div`
    animation: ${fade_in} 0.4s ease-in-out;
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const SubmissionActionButtons = styled.div`
    width: fit-content;
    position: absolute;
    margin-left: auto;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

export const SubmitButton = styled.button`
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
export const CancelButton = styled.button`
    border: 2px solid #4d4d4d;
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
            background-color: #1e1e1e;
            padding: 3px;
            border-radius: 4px;
            top: 0;
            color: lightgrey;
            transform: translate(-50%, -150%);
            animation: ${fade_in} 0.5s ease-in-out;
        }
    }
`
export const EditorWrap = styled.div`
    background-color: white;
    border-radius: 10px;
    border: 2px solid #4d4d4d;
    font-size: 18px;
    text-align: left;
    padding: 10px;
    background-color: #262626;
    max-height: 80vh;
    width: 100%;
    margin: 0 auto;
    overflow-y: scroll;
    color: white;
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

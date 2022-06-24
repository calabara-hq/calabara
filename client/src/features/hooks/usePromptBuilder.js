import React, { useReducer, useState } from 'react';

export default function usePromptBuilder() {

    // all fields besides prompt_blocks store fields that are actively updated. 
    // prompt blocks stores "finalized" configs from all prompts which we will send to server

    const initialPromptData = {
        selected_prompt: -2,
        prompt_heading: null,
        prompt_heading_error: false,
        prompt_label: null,
        prompt_label_color: 0,
        prompt_blocks: []
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case "PUSH_BLOCK":
                return {
                    ...state,
                    prompt_blocks: [...state.prompt_blocks, action.payload]
                }
            case "UPDATE_BLOCK":
                let arr_copy = [...state.prompt_blocks]
                arr_copy[state.selected_prompt] = action.payload
                return {
                    ...state,
                    prompt_blocks: arr_copy
                }
            case "DELETE_BLOCK":
                let blx_copy = [...state.prompt_blocks]
                blx_copy[state.selected_prompt] = action.payload
                blx_copy.splice(state.selected_prompt, 1)
                return {
                    ...state,
                    prompt_blocks: blx_copy,
                    selected_prompt: -2,
                    prompt_heading: null,
                    prompt_heading_error: false,
                    prompt_label: null,
                    prompt_label_color: 0
                }
            case "SET_SELECTED_PROMPT":
                return {
                    ...state,
                    selected_prompt: action.payload,
                }
            case "SET_PROMPT_HEADING":
                return {
                    ...state,
                    prompt_heading: action.payload,
                    prompt_heading_error: false,
                }
            case "SET_PROMPT_HEADING_ERROR":
                return {
                    ...state,
                    prompt_heading_error: true,
                }
            case "SET_PROMPT_LABEL":
                return {
                    ...state,
                    prompt_label: action.payload
                }
            case "SET_PROMPT_LABEL_COLOR":
                return {
                    ...state,
                    prompt_label_color: action.payload
                }
            case "SWITCH_PROMPTS":
                let index = action.payload;
                return {
                    ...state,
                    selected_prompt: index,
                    prompt_heading: state.prompt_blocks[index].title,
                    prompt_label: state.prompt_blocks[index].label.name,
                    prompt_label_color: state.prompt_blocks[index].label.color

                }
            case "NEW_PROMPT":
                return {
                    ...state,
                    selected_prompt: -1,//state.prompt_blocks.length,
                    prompt_heading: "",
                    prompt_label: "",
                    prompt_label_color: 0,

                }

            default: return state
        }
    }

    const [promptData, setPromptData] = useReducer(reducer, initialPromptData);


    const handleHeadingChange = (e) => {
        setPromptData({ type: "SET_PROMPT_HEADING", payload: e.target.value })
    }

    const handleLabelChange = (e) => {
        setPromptData({ type: "SET_PROMPT_LABEL", payload: e.target.value })
    }

    const handleLabelColorChange = (color) => {
        console.log(color)
        setPromptData({ type: "SET_PROMPT_LABEL_COLOR", payload: color })
    }

    const handleSwitchPrompts = (index) => {
        setPromptData({ type: "SWITCH_PROMPTS", payload: index })
    }

    const handleDeletePrompt = () => {
        setPromptData({type: "DELETE_BLOCK"})
    }

    // error handling

    const handleHeadingError = () => {
        setPromptData({ type: "SET_PROMPT_HEADING_ERROR" })
    }


    return {
        promptData,
        setPromptData,
        handleHeadingChange: (e) => handleHeadingChange(e),
        handleSwitchPrompts: (index) => handleSwitchPrompts(index),
        handleLabelChange: (e) => handleLabelChange(e),
        handleLabelColorChange: (color) => handleLabelColorChange(color),
        handleHeadingError: () => handleHeadingError(),
        handleDeletePrompt: () => handleDeletePrompt(),
    }

}
import React, { useReducer, useEffect } from 'react';

export default function usePromptBuilder() {

    const initialPromptData = {
        selected_prompt: -2,
        prompt_blocks: []
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case "PUSH_BLOCK":
                console.log('pushing block')
                return {
                    ...state,
                    prompt_blocks: [...state.prompt_blocks, action.payload]
                }
            case "UPDATE_BLOCK":
                console.log('updating block')
                let arr_copy = [...state.prompt_blocks]
                arr_copy[state.selected_prompt] = action.payload
                return {
                    ...state,
                    prompt_blocks: arr_copy
                }
            case "SET_SELECTED_PROMPT":
                console.log('updating selected prompt')
                return {
                    ...state,
                    selected_prompt: action.payload
                }

            default: return state
        }
    }

    const [promptData, setPromptData] = useReducer(reducer, initialPromptData);

    return {
        promptData,
        setPromptData
    }

}
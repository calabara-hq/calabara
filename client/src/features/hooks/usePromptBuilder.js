import React, { useReducer, useEffect } from 'react';

export default function usePromptBuilder() {

    const initialPromptData = {
        selected_prompt: null,
        prompt_blocks: []
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case "PUSH_BLOCK":
                return {
                    ...state,
                    prompt_blocks: [...state.prompt_blocks, action.payload]
                }
            case "SET_SELECTED_PROMPT":
                return{
                    ...state,
                    selected_prompt: action.payload
                }

            default: return state
        }
    }

    const [promptData, setPromptData] = useReducer(reducer, initialPromptData);

    useEffect(() => {
        console.log(promptData)
    }, [promptData])

    return {
        promptData,
        setPromptData
    }

}
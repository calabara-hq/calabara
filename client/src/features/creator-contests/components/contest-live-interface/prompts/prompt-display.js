import React, { useEffect, useState } from "react"
import { ParseBlocks } from "../block-parser";
import { Label } from "../../common/common_styles";
import { labelColorOptions } from "../../common/common_styles";
import ExpandedPrompt from "./expanded-prompt-display";
import DrawerComponent from "../../../../drawer/drawer";
import { selectPromptData } from "../interface/contest-interface-reducer";
import { useSelector } from "react-redux";
import {
    DefaultContainerWrap,
    PromptContainer,
    PromptTop,
    PromptContent,
    PromptCoverImage,
    PromptReadMore,
    ReadMoreButton,

} from "./styles";

export default function PromptDisplay({ }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const prompt_data = useSelector(selectPromptData)

    const handleDrawerOpen = () => {
        if (!isDrawerOpen) {
            setIsDrawerOpen(true);
            document.body.style.overflow = 'hidden';
        }
    }

    const handleDrawerClose = () => {
        console.log('closing!!')
        document.body.style.overflow = 'unset';
        setIsDrawerOpen(false);
        setIsCreating(false);
    }


    return (
        <DefaultContainerWrap onClick={handleDrawerOpen}>
            <PromptContainer >
                <PromptTop>
                    <h3>{prompt_data.title}</h3>
                    <Label color={labelColorOptions[prompt_data.promptLabelColor]}>{prompt_data.promptLabel}</Label>
                </PromptTop>
                <PromptContent>
                    <PromptCoverImage src={prompt_data.coverImage} />
                    <ParseBlocks data={prompt_data.editorData} />
                </PromptContent>
                <PromptReadMore>
                    <ReadMoreButton>Show more</ReadMoreButton>
                </PromptReadMore>
            </PromptContainer>
            <ExpandedPromptComponent isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose} isCreating={isCreating} setIsCreating={setIsCreating} />
        </DefaultContainerWrap>
    )
}

export function ExpandedPromptComponent({ isDrawerOpen, handleDrawerClose, isCreating, setIsCreating }) {
    return (
        <DrawerComponent drawerOpen={isDrawerOpen} handleClose={handleDrawerClose} showExit={!isCreating} customWidth={isCreating ? '70vw' : '40vw'}>
            <ExpandedPrompt isCreating={isCreating} setIsCreating={setIsCreating} handleClose={handleDrawerClose} />
        </DrawerComponent>
    )
}

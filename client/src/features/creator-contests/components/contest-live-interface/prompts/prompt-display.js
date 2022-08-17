import { useState } from "react";
import { ParseBlocks } from "../block-parser";
import styled from 'styled-components';
import { Label, labelColorOptions } from "../../common/common_styles";
import { contest_data } from "../temp-data";
import SubmissionModal from "../submissions/edit-submission-modal";

const PromptContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #1d1d1d;
    padding: 10px;
    border: none;
    border-radius: 10px;
`

const PromptContainerWrap = styled.div`
width: 50%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin: auto;



`

const CollapsiblePrompt = styled.div`
    display: flex;
    flex-direction: column;
    width: '100%';
    justify-content: center;
    align-items: flex-start;
    grid-gap: 20px;
    border: 2px solid black;
    border-radius: 4px;
    background-color: #1c2128;
    color: #d3d3d3;
    padding: 5px;
    cursor: pointer;
    margin-bottom: 10px;
`

const PromptTop = styled.div`
    display: flex;
    align-items: center;
    width: 100%;

    & ${Label}{
        margin-left: auto;
        margin-right: 5px;
    }
`

const PromptContent = styled.div`
    display: flex;
    flex-direction: column;
    max-height: ${props => props.isOpen ? '150px' : '0px'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    width: 100%;
`



const NewSubmissionButton = styled.button`
    width: 10em;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    margin-left: auto;
    margin-right: 5px;
    margin-top: 2em;
    margin-bottom: 2em;
    color: black;
    background-color: #00a368;
`


export default function PromptDisplay({ setIsSubmissionBuilder }) {
    const [openPromptIndex, setOpenPromptIndex] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenPrompt = (index) => {
        if (openPromptIndex === index) return setOpenPromptIndex(-1)
        return setOpenPromptIndex(index)
    }


    const handleSubmissionClose = async (cleanup) => {
        if (cleanup.type === 'standard') {
            setModalOpen(false);
        }
    }

    const handleSubmissionOpen = async () => {
        setModalOpen(true)
    }

    const handlePromptClick = (e, index) => {
        if (openPromptIndex === index) {
            setOpenPromptIndex(-1);
            setIsSubmissionBuilder(false);
            e.stopPropagation();
        }
        else {
            setOpenPromptIndex(index)
        }
    }

    return (
        <PromptContainerWrap>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Prompts</h2>
            <PromptContainer>
                {contest_data.prompts.map((prompt, index) => {
                    return (
                        <CollapsiblePrompt onClick={(e) => handlePromptClick(e, index)} isOpen={openPromptIndex === index}>
                            <PromptTop>
                                <h4>{prompt.title}</h4>
                                <Label color={labelColorOptions[prompt.label.color]}>{prompt.label.name}</Label>
                            </PromptTop>
                            <PromptContent isOpen={openPromptIndex === index}>
                                <ParseBlocks data={prompt} />
                                <NewSubmissionButton onClick={handleSubmissionOpen}>Create Submission</NewSubmissionButton>
                                {modalOpen && <SubmissionModal modalOpen={modalOpen} handleClose={handleSubmissionClose} selectedPrompt={prompt} />}
                            </PromptContent>
                        </CollapsiblePrompt>
                    )
                })}
            </PromptContainer>
        </PromptContainerWrap>
    )
}
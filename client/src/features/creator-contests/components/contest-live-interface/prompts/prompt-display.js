import { useEffect, useState } from "react";
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
    flex-direction: column;
    width: 100%;
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
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
    max-height: ${props => props.isVisible ? '300px' : '0px'};
    transition: visibility 0.2s, max-height 0.3s ease-in-out;

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
    width: 12em;
    padding: 5px 5px;
    border: 2px solid #00a368;
    border-radius: 4px;
    margin-left: auto;
    margin-right: 5px;
    margin-top: 2em;
    margin-bottom: 2em;
    color: ${props => props.isCreating ? '#00a368' : 'black'};
    background-color: ${props => props.isCreating ? 'transparent' : '#00a368'};
    transition: background-color 0.2s ease-in-out;
    transition: color 0.3s ease-in-out;
`


export default function PromptDisplay({ setIsSubmissionBuilder, createSubmissionIndex, setCreateSubmissionIndex }) {
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

    const handleSubmissionOpen = async (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setCreateSubmissionIndex(index)
        setIsSubmissionBuilder(true);
        //setModalOpen(true)
    }

    const handlePromptClick = (e, index) => {
        if (createSubmissionIndex === -1) {
            if (openPromptIndex === index) {
                setOpenPromptIndex(-1);
                setIsSubmissionBuilder(false);
                setCreateSubmissionIndex(-1);
                e.stopPropagation();
            }
            else {
                setOpenPromptIndex(index);
                setCreateSubmissionIndex(-1);
            }
        }
    }

    return (
        <PromptContainerWrap>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Prompts</h2>
            <PromptContainer>
                {contest_data.prompts.map((prompt, index) => {
                    return (
                        <CollapsiblePrompt onClick={(e) => handlePromptClick(e, index)} isOpen={openPromptIndex === index} isVisible={createSubmissionIndex === -1 ? true : createSubmissionIndex === index}>
                            <PromptTop>
                                <h4>{prompt.title}</h4>
                                <Label color={labelColorOptions[prompt.label.color]}>{prompt.label.name}</Label>
                            </PromptTop>
                            <PromptContent isOpen={openPromptIndex === index}>
                                <ParseBlocks data={prompt} />
                                <NewSubmissionButton isCreating={createSubmissionIndex === index} onClick={(e) => handleSubmissionOpen(e, index)}>{createSubmissionIndex === index ? 'Creating Submission' : 'Create Submission'}</NewSubmissionButton>
                                {/*modalOpen && <SubmissionModal modalOpen={modalOpen} handleClose={handleSubmissionClose} selectedPrompt={prompt} />*/}
                            </PromptContent>
                        </CollapsiblePrompt>
                    )
                })}
            </PromptContainer>
        </PromptContainerWrap>
    )
}
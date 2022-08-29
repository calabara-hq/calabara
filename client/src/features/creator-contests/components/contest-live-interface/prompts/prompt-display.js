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
    width: 95%;
    background-color: #1e1e1e;
    border: none;
    border-radius: 10px;
    padding: 10px;
`

const PromptContainerWrap = styled.div`
    flex: 0 0 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-content: flex-end;
    align-items: center;
    //margin-bottom: auto;
    & :hover{

        background-color: #1e1e1e;

        }


`

const CollapsiblePrompt = styled.div`
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    color: #d3d3d3;
    background-color: #262626;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 5px;
    grid-gap: 20px;
    cursor: pointer;
    margin-bottom: 10px;
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
    max-height: ${props => props.isVisible ? '300px' : '0px'};
    transition: visibility 0.2s, max-height 0.3s ease-in-out;
    &:hover{
        background-color: #1e1e1e;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);

        transform: scale(1.01);
        transition-duration: 0.5s;

    }


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
const AltSubmissionButton = styled.button`
    width: 12em;
    //font-weight: 550;
    padding: 5px 5px;
    border: 2px solid ${props => props.isCreating ? 'rgb(138,128,234)' : 'transparent'};
    border-radius: 4px;
    margin-left: auto;
    margin-right: 5px;
    margin-top: 2em;
    margin-bottom: 2em;
    color: ${props => props.isCreating ? 'rgb(138,128,234)' : 'rgb(138,128,234)'};
    background-color: ${props => props.isCreating ? 'transparent' : 'rgb(138,128,234,.3)'};
    transition: background-color 0.2s ease-in-out;
    transition: color 0.3s ease-in-out;

    &:hover{
        //border: 2px solid white;
        background-color: ${props => props.isCreating ? 'transparent' : 'rgb(138,128,234)'};
        color: ${props => props.isCreating ? 'rgb(138,128,234)' : '#fff'};


    }

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
            <PromptContainer>
            <h2 style={{ textAlign: 'center', color: '#d9d9d9', marginBottom: '30px', marginTop: '0px'}}>Prompts</h2>

                {contest_data.prompts.map((prompt, index) => {
                    return (
                        <CollapsiblePrompt onClick={(e) => handlePromptClick(e, index)} isOpen={openPromptIndex === index} isVisible={createSubmissionIndex === -1 ? true : createSubmissionIndex === index}>
                            <PromptTop>
                                <h4>{prompt.title}</h4>
                                <Label color={labelColorOptions[prompt.label.color]}>{prompt.label.name}</Label>
                            </PromptTop>
                            <PromptContent isOpen={openPromptIndex === index}>
                                <ParseBlocks data={prompt} />
                                <AltSubmissionButton isCreating={createSubmissionIndex === index} onClick={(e) => handleSubmissionOpen(e, index)}>{createSubmissionIndex === index ? 'Creating Submission' : 'Create Submission'}</AltSubmissionButton>
                                {/*modalOpen && <SubmissionModal modalOpen={modalOpen} handleClose={handleSubmissionClose} selectedPrompt={prompt} />*/}
                            </PromptContent>
                        </CollapsiblePrompt>
                    )
                })}
            </PromptContainer>
        </PromptContainerWrap>
    )
}
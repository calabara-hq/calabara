import { useEffect, useState } from "react";
import { ParseBlocks } from "../block-parser";
import styled from 'styled-components';
import { Label, labelColorOptions, fade_in } from "../../common/common_styles";
import { contest_data } from "../temp-data";
import SubmissionModal from "../submissions/edit-submission-modal";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import SubmissionBuilder from "../submissions/submission-builder-3";

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
        transform: scale(1.01);
        transition-duration: 0.5s;

    }


`

const PromptTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    

    & ${Label}{
        margin-left: 50px;
        margin-right: 5px;
    }
`

const PromptContent = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    width: 100%;
`


const AltSubmissionButton = styled.button`
    width: 12em;
    //font-weight: 550;
    padding: 5px 5px;
    border: 2px solid ${props => props.isCreating ? 'rgb(138,128,234)' : 'transparent'};
    border-radius: 4px;
    margin-left: auto;
    margin-top: 2em;
    margin-right: 10px;
    margin-bottom: 10px;
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
const DrawerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    margin-left: 20px;
    margin-top: 50px;
    height: 100%;
    color: #d3d3d3;
`

const PromptWrap = styled.div`
    background-color: #262626;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 5px;
    width: 95%;

`

const FadeDiv = styled.div`
    animation: ${fade_in} 0.5s ease-in-out;

`


export default function PromptDisplay({ setIsSubmissionBuilder, createSubmissionIndex, setCreateSubmissionIndex, contest_settings }) {
    const [openPromptIndex, setOpenPromptIndex] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


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

        if (openPromptIndex === -1) {
            setOpenPromptIndex(index);
            document.body.style.overflow = 'hidden';
        }
        else {
            setOpenPromptIndex(-1)
            setIsCreating(false)
            document.body.style.overflow = 'unset';

        }

        /*
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
        */
    }


    const handleCreateSubmission = () => {
        setIsCreating(true)
    }

    const handleCloseDrawer = () => {
        setIsCreating(false)
    }
    console.log(contest_settings)

    return (
        <PromptContainerWrap>
            <PromptContainer>
                <h2 style={{ textAlign: 'center', color: '#d9d9d9', marginBottom: '30px', marginTop: '0px' }}>Prompts</h2>

                {contest_data.prompts.map((prompt, index) => {
                    return (
                        <CollapsiblePrompt onClick={(e) => handlePromptClick(e, index)} isVisible={createSubmissionIndex === -1 ? true : createSubmissionIndex === index}>
                            <PromptTop>
                                <h4>{prompt.title}</h4>
                                <Label color={labelColorOptions[prompt.label.color]}>{prompt.label.name}</Label>
                            </PromptTop>
                        </CollapsiblePrompt>
                    )
                })}
            </PromptContainer>
            <Drawer
                open={openPromptIndex > -1}
                onClose={() => handlePromptClick(null, openPromptIndex)}
                direction='right'
                className='bla bla bla'
                size={isCreating ? '70vw' : '40vw'}
                style={{ backgroundColor: '#1e1e1e', overflowY: 'scroll' }}
            >
                {openPromptIndex > -1 &&
                    <DrawerWrapper>

                        {!isCreating &&
                            <PromptWrap>
                                <PromptTop>
                                    <h4>{contest_data.prompts[openPromptIndex].title}</h4>
                                    <Label color={labelColorOptions[contest_data.prompts[openPromptIndex].label.color]}>{contest_data.prompts[openPromptIndex].label.name}</Label>
                                </PromptTop>
                                <PromptContent>
                                    <ParseBlocks data={contest_data.prompts[openPromptIndex]} />
                                    <AltSubmissionButton onClick={handleCreateSubmission}>Create Submission</AltSubmissionButton>
                                </PromptContent>
                            </PromptWrap>
                        }
                        {isCreating &&
                            <FadeDiv>
                                <SubmissionBuilder handleCloseDrawer={handleCloseDrawer} submitter_restrictions={contest_settings.submitter_restrictions}/>
                            </FadeDiv>
                        }
                    </DrawerWrapper>
                }
            </Drawer>

        </PromptContainerWrap >
    )
}
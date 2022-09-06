import React, { useEffect, useState } from "react"
import styled, { keyframes, css } from "styled-components"
import { ParseBlocks } from "../block-parser";
import { Label } from "../../common/common_styles";
import { labelColorOptions } from "../../common/common_styles";
import SubmissionBuilder from "../submissions/submission-builder";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { fade_in, Contest_h2_alt } from "../../common/common_styles";
import useSubmissionEngine from "../../../../hooks/useSubmissionEngine";
import { useWalletContext } from "../../../../../app/WalletContext";
import { contestState, selectContestState } from "../interface/contest-interface-reducer";
import { useSelector } from "react-redux";


const DefaultContainerWrap = styled.div`
    display: flex;
    flex: 1 0 70%;
    flex-direction: column;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    position: relative;

`

const PromptContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    border-radius: 4px;

    transition: visibility 0.2s, max-height 0.3s ease-in-out;


    &:hover {
        cursor: pointer;
        
    }


`

const PromptContainerTop = styled.div`
    display: flex;
    width: 100%;
`


const PromptHeading = styled.div`
    display: flex;
    flex-direction: row;
    align-self: flex-start;
    align-items: center;

    > h2{
        color: #d9d9d9;
        margin:0;
        
    }

    & ${Label}{
        height:fit-content;
        margin-left: 20px;    
    }

`

const PromptDataSplit = styled.div`
    display: flex;
    width: 100%;
    margin-top: 15px;
    height: 100%;

`

const PromptLeft = styled.div`
    flex: 1 1 70%;
    height: 100%;
    overflow: hidden;

`


const PromptBody = styled.div`
    align-self: flex-start;
    margin-top: 10px;
    

    > p {
        font-size: 16px;
        color: #d3d3d3;
        text-align: left;
    }
`



const PromptRight = styled.div`
    flex: 1 0 30%;
    display: flex;
    flex-direction: column;
    position: relative;

`


const PromptCoverImage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100%;
    > img {
        align-self: center;
        justify-self: center;
        max-width: 12em;
        border-radius: 10px;
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



// prompt sidebar styling




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
    height: 40px;
    font-size: 15px;
    color: rgb(138,128,234);
    background-color: rgb(138,128,234,.3);
    border: 2px solid rgb(138,128,234,.3);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 5px;
    transition: background-color 0.2 ease-in-out;
    transition: color 0.3s ease-in-out;
    &:hover{
        background-color: rgb(138,128,234);
        color: #fff;
    
    }

    &:disabled{
    cursor: not-allowed;
    color: rgb(138,128,234,.3);
    background-color: #262626;

    }
`

const CreateSubmissionButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
`



export default function PromptDisplay({ contest_settings, prompt_data }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const contestState = useSelector(selectContestState);



    const handlePromptClick = () => {
        if (!isDrawerOpen) {
            setIsDrawerOpen(true);
            document.body.style.overflow = 'hidden';
        }
        else {
            setIsDrawerOpen(false);
            setIsCreating(false);
            document.body.style.overflow = 'unset';

        }
    }


    return (
        <DefaultContainerWrap>
            <PromptContainer onClick={handlePromptClick}>

                <PromptDataSplit>
                    <PromptLeft>
                        <PromptHeading>
                            <h2>{prompt_data.title}</h2>
                            <Label color={labelColorOptions[prompt_data.promptLabelColor]}>{prompt_data.promptLabel}</Label>
                        </PromptHeading>
                        <PromptBody>
                            <ParseBlocks data={prompt_data.editorData} />
                        </PromptBody>
                    </PromptLeft>
                    <PromptRight>
                        <PromptCoverImage>
                            <img src={prompt_data.coverImage} />
                        </PromptCoverImage>
                        {contestState === 0 &&
                            <CreateSubmissionButtonContainer>
                                <AltSubmissionButton>Create Submission</AltSubmissionButton>
                            </CreateSubmissionButtonContainer>
                        }
                    </PromptRight>
                </PromptDataSplit>

            </PromptContainer>
            <Drawer
                open={isDrawerOpen}
                onClose={handlePromptClick}
                direction='right'
                className='bla bla bla'
                size={isCreating ? '70vw' : '40vw'}
                style={{ backgroundColor: '#1e1e1e', overflowY: 'scroll' }}
            >
                {isDrawerOpen &&
                    <DrawerWrapper>
                        {<ExpandedPromptSidebar contest_settings={contest_settings} prompt_data={prompt_data} isCreating={isCreating} setIsCreating={setIsCreating} toggleDrawer={handlePromptClick} />}
                    </DrawerWrapper>
                }
            </Drawer>
        </DefaultContainerWrap>
    )
}







const SubmissionRequirements = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1e1e1e;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    padding: 5px;
    margin: 20px auto;
`

const EligibilityCheck = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > p {
        margin: 0;
        margin-right: 20px;
    }
    > button {
        border: double 2px transparent;
        border-radius: 10px;
        background-image: linear-gradient(#141416,#141416), linear-gradient(to right,#e00f8e,#2d66dc);
        background-origin: border-box;
        background-clip: padding-box,border-box;
        box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
        padding: 3px 5px;
    }
`

const highlight = (props) => keyframes`
  0% {
    opacity: 0;
    transform: scale(1.0);
  }
  50% {
    opacity: 1 !important;
    transform: scale(1.7);
  }
  100% {
    opacity: 1 !important;
    transform: scale(1.0);
    display: visible;
  }
   
`;

const highlightAnimation = css`
  animation: ${highlight} 1s ease;
`;


const RestrictionStatus = styled.span`
    display: inline-block;
    &::after{
        font-family: 'Font Awesome 5 Free';
        margin-left: 20px;
        content: '${props => props.status ? "\f058" : "\f057"}';
        color: ${props => props.status ? 'rgb(6, 214, 160)' : 'grey'};
        font-weight: 900;
    }
    
   // animation: ${highlight} ${props => props.index * 0.9}s ease-in;
   //color: #1e1e1e;
    animation: ${highlight} 1s ease-in;
    animation-delay: ${props => props.index * 0.3}s;
   
`

const RestrictionStatusNotConnected = styled.span`
    display: inline-block;
    &::after{
        font-family: 'Font Awesome 5 Free';
        margin-left: 20px;
        content:  "\f057";
        color:  grey;
        font-weight: 900;
    }
`

const SubButton = styled.div`
    display:flex;
    flex-direction: row;
    margin-left: auto;
    margin-top: 2em;
    margin-right: 10px;
    margin-bottom: 10px;
    grid-gap: 10px;
`

const ConnectWalletButton = styled.button`
    height: 40px;
    //width: 12em;
    font-size: 15px;
    //font-weight: 550;
    color: #f2f2f2;
    background-image: linear-gradient(#262626, #262626),linear-gradient(90deg,#e00f8e,#2d66dc);
    background-origin: border-box;
    background-clip: padding-box,border-box;
    border: 2px double transparent;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    cursor: pointer;
    &:hover{
        background-color: #1e1e1e;
        background-image: linear-gradient(#141416, #141416),
        linear-gradient(to right, #e00f8e, #2d66dc);
    }
    
`

function ExpandedPromptSidebar({ contest_settings, prompt_data, isCreating, setIsCreating, toggleDrawer }) {
    const { walletConnect } = useWalletContext();
    const { isWalletConnected, alreadySubmittedError, restrictionResults, isUserEligible } = useSubmissionEngine(contest_settings.submitter_restrictions);

    const handleCreateSubmission = () => {
        setIsCreating(true);
    }

    const handleCloseDrawer = () => {
        setIsCreating(false);
    }



    return (
        <>
            {!isCreating &&
                <>
                    <PromptWrap>
                        <PromptTop>
                            <h4>{prompt_data.title}</h4>
                            <Label color={labelColorOptions[prompt_data.promptLabelColor]}>{prompt_data.promptLabel}</Label>
                        </PromptTop>
                        <PromptContent>
                            <ParseBlocks data={prompt_data.editorData} />
                        </PromptContent>
                    </PromptWrap>

                    <SubmissionRequirements>
                        {Object.values(restrictionResults).length > 0 &&
                            <>
                                <Contest_h2_alt style={{ marginBottom: '30px', marginTop: '20px' }}>Submission Requirements</Contest_h2_alt>
                                {alreadySubmittedError && <p style={{ fontSize: '18px' }}>Limit 1 submission <RestrictionStatus isConnected={isWalletConnected} status={!alreadySubmittedError} key={`${isWalletConnected}-already-submitted`} /></p>}
                                {Object.values(restrictionResults).map((restriction, index) => {
                                    if (restriction.type === 'erc20' || restriction.type === 'erc721') {
                                        return (
                                            <>
                                                <p style={{ fontSize: '18px' }}>
                                                    {restriction.threshold} {restriction.symbol}
                                                    {isWalletConnected && <RestrictionStatus index={index + 1} isConnected={isWalletConnected} status={restriction.user_result} key={`${isWalletConnected}-${restriction.user_result}`} />}
                                                    {!isWalletConnected && <RestrictionStatusNotConnected />}
                                                </p>
                                                {index !== Object.entries(restrictionResults).length - 1 && <p>or</p>}
                                            </>
                                        )
                                    }
                                })}


                                <SubButton>
                                    {!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>Connect Wallet</ConnectWalletButton>}
                                    <AltSubmissionButton disabled={!isUserEligible} onClick={handleCreateSubmission}>Create Submission</AltSubmissionButton>
                                </SubButton>
                            </>
                        }
                    </SubmissionRequirements>
                </>
            }
            {isCreating &&
                <FadeDiv>
                    <SubmissionBuilder handleCloseDrawer={handleCloseDrawer} restrictionResults={restrictionResults} isUserEligible={isUserEligible} toggleDrawer={toggleDrawer} />
                </FadeDiv>
            }
        </>
    )

}


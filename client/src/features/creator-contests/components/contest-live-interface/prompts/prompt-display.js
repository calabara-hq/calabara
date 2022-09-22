import React, { useEffect, useState } from "react"
import styled, { keyframes, css } from "styled-components"
import { ParseBlocks } from "../block-parser";
import { Label } from "../../common/common_styles";
import { labelColorOptions } from "../../common/common_styles";
import SubmissionBuilder from "../submissions/submission-builder";
import Drawer from 'react-modern-drawer'
//import 'react-modern-drawer/dist/index.css'
import { fade_in, Contest_h2_alt } from "../../common/common_styles";
import useSubmissionEngine from "../../../../hooks/useSubmissionEngine";
import { useWalletContext } from "../../../../../app/WalletContext";
import { contestState, selectContestSettings, selectContestState, selectPromptData } from "../interface/contest-interface-reducer";
import { useSelector } from "react-redux";


const DefaultContainerWrap = styled.div`
    display: flex;
    flex: 1 0 70%;
    flex-direction: column;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    height: 290px;
    animation: ${fade_in} 0.2s ease-in-out;
    cursor: pointer;

`

const PromptContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    border-radius: 4px;
    transition: visibility 0.2s, max-height 0.3s ease-in-out;
    color: #d3d3d3;
    overflow: hidden;

    > p {
        font-size: 16px;
    }

    > img {
        max-width: 15em;
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
    //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    //border: 2px solid #4d4d4d;
    border-radius: 10px;
    padding: 10px;
    width: 95%;

    > p {
        font-size: 15px;
    }
`

const FadeDiv = styled.div`
    animation: ${fade_in} 0.5s ease-in-out;
`

const PromptTop = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px;
    margin-bottom: 20px;
    color: #bfbfbf;

    > ${Label}{
        margin-left: 10px;
        margin-right: 10px;
    }


    > h3 {
        margin-top: 0px;
        margin-bottom: 0px;
        font-size: 2em;
    }

    @media screen and (max-width: 600px){
        > h3{
            font-size: 1.5em;
        }
    }
`
const PromptContent = styled.div`
    @media screen and (max-width: 700px){
        > img{
            max-width: 8em;
            justify-self: center;
            align-self: center;
        }
    }

    @media screen and (max-width: 500px){
        > img{
            max-width: 6em;
            justify-self: center;
            align-self: center;
        }
    }

`

const PromptReadMore = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    background-image: linear-gradient(to bottom, rgba(30, 30, 30, 0), rgba(30, 30, 30, 1) );
    height: 40px;
    width: 100%;

`

const ReadMoreButton = styled.button`
    border-radius: 100px;
    border: 2px solid rgba(191, 191, 191, 0.5);
    background-color: #1e1e1e;
    padding: 5px 10px;
    &:hover{
        border-color: rgba(191, 191, 191, 0.9);
        transition: border-color 0.2s ease-in-out;
    }
    
`

const PromptCoverImage = styled.img`
    float: right;
    max-width: 12em;
    max-height: 12em;
    border-radius: 10px;

`


const AltSubmissionButton = styled.button`
    height: 40px;
    font-size: 15px;
    color: rgb(138,128,234);
    background-color: rgb(138,128,234,.3);
    border: 2px solid rgb(138,128,234,.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);

    border-radius: 10px;
    padding: 5px 20px;
    transition: background-color 0.2 ease-in-out;
    transition: color 0.3s ease-in-out;
    overflow: hidden;

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
    position: absolute;
    bottom: 10px;
    right: 25px;


`



export default function PromptDisplay({ }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const prompt_data = useSelector(selectPromptData)

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setIsCreating(false);
        document.body.style.overflow = 'unset';

    }


    return (
        <>
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
                <ContestPromptDrawer isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose} isCreating={isCreating} setIsCreating={setIsCreating} />
            </DefaultContainerWrap>
        </>
    )
}



export function ContestPromptDrawer({ isDrawerOpen, handleDrawerClose, isCreating, setIsCreating }) {
    return (
        <Drawer
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            direction='right'
            className='expand prompt'
            size={isCreating ? '70vw' : '40vw'}
            style={{ backgroundColor: '#1e1e1e', overflowY: 'scroll' }}
        >
            <DrawerWrapper>
                {isDrawerOpen && <ExpandedPromptSidebar isCreating={isCreating} setIsCreating={setIsCreating} toggleDrawer={handleDrawerClose} />}
            </DrawerWrapper>
        </Drawer>
    )
}


const SubmissionRequirements = styled.div`
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1e1e1e;
    //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border: 1px solid #4d4d4d;
    border-radius: 10px;
    padding: 5px;
    margin-top: 20px;

    > h2 {
        text-align: center;
        font-size: 18px;
        font-weight: 500;
    }

    > p {
        font-size: 16px;
    }
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
    flex-wrap: wrap;
    justify-content: center;
    //margin-left: auto;
    margin-top: 2em;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: auto;
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
    overflow: hidden;
    &:hover{
        background-color: #1e1e1e;
        background-image: linear-gradient(#141416, #141416),
        linear-gradient(to right, #e00f8e, #2d66dc);
    }
    
`

function ExpandedPromptSidebar({ isCreating, setIsCreating, toggleDrawer }) {
    const { walletConnect } = useWalletContext();
    const prompt_data = useSelector(selectPromptData)
    const contest_settings = useSelector(selectContestSettings)
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
                            <h3>{prompt_data.title}</h3>
                            <Label color={labelColorOptions[prompt_data.promptLabelColor]}>{prompt_data.promptLabel}</Label>
                        </PromptTop>
                        <PromptContent>
                            <PromptCoverImage src={prompt_data.coverImage} />
                            <ParseBlocks data={prompt_data.editorData} />
                        </PromptContent>
                    </PromptWrap>

                    <SubmissionRequirements>
                        <>
                            <h2 style={{ marginBottom: '30px', marginTop: '20px' }}>Submission Requirements</h2>
                            <p >Limit 1 submission <RestrictionStatus isConnected={isWalletConnected} status={!alreadySubmittedError} key={`${isWalletConnected}-already-submitted`} /></p>
                            {Object.values(restrictionResults).map((restriction, index) => {
                                if (restriction.type === 'erc20' || restriction.type === 'erc721') {
                                    return (
                                        <>
                                            <p>
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


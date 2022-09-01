import { useEffect, useState } from "react";
import styled from 'styled-components'
import { ParseBlocks } from "../block-parser";
import { SubmissionVotingBox } from "../vote/voting-components";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { selectContestState } from "../interface/contest-interface-reducer";
import { useSelector } from "react-redux";
import { fade_in } from "../../common/common_styles";


const ToolbarTop = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    
`

const ExitButton = styled.button`
    font-weight: bold;
    background-color: #2d2e35;
    color: lightcoral;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    margin-left: auto;

`


const DrawerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 95%;
    margin: 0 auto;
    margin-left: 20px;
    margin-top: 50px;
    height: 100%;
    color: #d3d3d3;
    animation: ${fade_in} 0.5s ease-in-out;

    > * {
        margin-bottom: 30px;
    }
`


export default function ExpandSubmissionDrawer({ drawerOpen, handleClose, id, TLDRImage, TLDRText, expandData }) {
    const contest_state = useSelector(selectContestState)

    useEffect(() => {},[contest_state])

    return (

        <Drawer
            open={drawerOpen}
            onClose={handleClose}
            direction='right'
            className='bla bla bla'
            size='60vw'
            style={{ backgroundColor: '#1e1e1e', overflowY: 'scroll' }}
        >
            {drawerOpen &&
                <DrawerWrapper>
                    {contest_state === 1 && <SubmissionVotingBox sub_id={id} />}
                    <SubmissionWrap>
                        <p>{TLDRText}</p>
                        <img src={TLDRImage}></img>
                        {expandData && <ParseBlocks data={expandData} />}
                    </SubmissionWrap>
                </DrawerWrapper>
            }
        </Drawer>
    )
}

const SubmissionWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #262626;
    border-radius: 10px;
    padding: 10px;
    > h2 {
        color: #d9d9d9;
    }
    
    > p {
        font-size: 15px;
        color: #d3d3d3;
    }

    > img {
        max-width: 35em;
        //max-height: 20em;
        align-self: center;
        border-radius: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    > * {
        margin-top: 20px;
        margin-bottom: 20px;
        margin-right: 30px;

    }
    
`



function ViewSubmission({ drawerOpen, handleClose, TLDRImage, TLDRText, expandData }) {
    return (
        <Drawer
            open={drawerOpen}
            onClose={handleClose}
            direction='right'
            className='bla bla bla'
            size='40vw'
            style={{ backgroundColor: '#1e1e1e', overflowY: 'scroll' }}
        >
            <DrawerWrapper>
                <SubmissionWrap>
                    <p>{TLDRText}</p>
                    <img src={TLDRImage}></img>
                    <ParseBlocks data={expandData} />
                </SubmissionWrap>
            </DrawerWrapper>
        </Drawer>

    )
}

/*
<SubmissionWrap>
    <p>{TLDRText}</p>
    <img src={TLDRImage}></img>
    <ParseBlocks data={expandData} />
</SubmissionWrap>
*/
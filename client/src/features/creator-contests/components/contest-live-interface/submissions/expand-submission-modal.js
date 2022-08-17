import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styled from 'styled-components'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ParseBlocks } from "../block-parser";
import { SubmissionVotingBox } from "../vote/voting-components";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 'calc(100% - 144px)',
    width: 'calc(100% - 400px)',
    bgcolor: '#1e1e1e',
    border: '2px solid rgba(29, 29, 29, 0.3)',
    borderRadius: '10px',
    boxShadow: 20,
    p: 4,
    minWidth: '400px',
    maxWidth: '970px',
    //minHeight: '80vh',
    //width: '80vw',
    // maxWidth: '1130px',
    //minWidth: '350px'
};

const ModalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;

`
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

export default function ViewSubmissionModal({ modalOpen, handleClose, id, TLDRImage, TLDRText, expandData }) {

    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <ModalWrapper>
                        <ToolbarTop>
                            <SubmissionVotingBox sub_id={id}/>
                        </ToolbarTop>
                        <ViewSubmission TLDRImage={TLDRImage} TLDRText={TLDRText} expandData={expandData} />
                    </ModalWrapper>

                </Box>
            </Modal>
        </div>
    );
}

const SubmissionWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-height: 600px;
    overflow-y: scroll;
    scroll-margin-left: 20px;

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



function ViewSubmission({ TLDRImage, TLDRText, expandData }) {
    return (
        <SubmissionWrap>
            <p>{TLDRText}</p>
            <img src={TLDRImage}></img>
            <ParseBlocks data={expandData} />
        </SubmissionWrap>
    )
}
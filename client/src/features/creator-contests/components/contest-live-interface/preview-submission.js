import React, { useState, useEffect, useRef } from 'react'
import { ParseBlocks } from './block-parser';
import styled, { css } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';



const SubmissionContainer = styled.div`
    flex-grow: 0;
    width: ${props => props.expanded ? '80%' : '30%'};
    height: fit-content;
    border-radius: 10px;
    min-height: 200px;
    max-height: 45vh;
    //width: 80%;
    font-size: 20px;
    text-align: left;
    padding: 10px;
    background-color: #1c2128;
    color: #d3d3d3;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

`
const SubmissionContent = styled.div`
    border-radius: 10px;
    height: ${props => props.expanded ? '500px' : '25ch'};
    overflow-y: ${props => props.expanded ? 'scroll' : 'hidden'};
    overflow-x: hidden;
    font-size: 20px;
    text-align: left;
    padding: 10px;
    background-color: #1c2128;
    color: #d3d3d3;
    position: relative;


    img{
        display: block;
        max-width: ${props => props.expanded ? '15em' : '10em'};
        margin: 20px auto;
        border-radius: 10px;
    }
`


const SubmissionWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    //grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 400px;
`
const DropdownButton = styled.button`
    margin-top: auto;
    width: 100%;
    justify-self: center;
    align-self: center;
    color: grey;
    font-size: 16px;
    background-color: transparent;
    border: none;
    border-radius: 10px;
    padding: 10px 0px;
    &:hover{
        background-color: #33373d;
    }
`

export default function PreviewSubmission({ setProgress, TLDRImage, TLDRText, longFormValue }) {
    const [expanded, setExpanded] = useState(false);
    const submissionRef = useRef(null)


    const handleExpand = () => {
        if (expanded) return setExpanded(false)
        setExpanded(true)
        //submissionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', duration: '2s'});
    }


    return (
        <SubmissionContainer expanded={expanded} ref={submissionRef}>
            <SubmissionContent expanded={expanded}>
                <p>{TLDRText}</p>
                <img src={TLDRImage} />
                {expanded && <ParseBlocks data={longFormValue} />}
            </SubmissionContent>
            <DropdownButton onClick={handleExpand}><FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} /></DropdownButton>
        </SubmissionContainer>
    )
}
import React, { useState, useEffect, useRef } from 'react';
import { contest_data } from '../temp-data';
import styled, { keyframes, css } from 'styled-components'
import { ParseBlocks } from '../block-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { fade_in } from '../../common/common_styles';
import ViewSubmissionModal from './expand-submission-modal';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const SubmissionWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 30px;
    margin-bottom: 400px;
    background-color: #1d1d1d;
    padding: 10px;
    border: none;
    border-radius: 10px;
`

const SubmissionPreviewContainer = styled.div`
    display: flex;
    flex: 1 1 30%;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #1c2128;
    padding: 10px;
    font-size: 20px;
    border: 2px solid black;;
    border-radius: 10px;
    color: #d3d3d3;
    transition: width 0.6s ease-in-out;
    cursor: pointer;
`

const PreviewImage = styled.img`
    max-width: 15em;
    margin: auto;
    border-radius: 10px;
`

const CollapsibleSubmission = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    grid-gap: 20px;
    border-radius: 4px;
    background-color: #1c2128;
    color: #d3d3d3;
    padding: 5px;
    cursor: pointer;
    margin-bottom: 10px;
   
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

export default function SubmissionDisplay({ }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [TLDRImage, setTLDRImage] = useState(null);
    const [TLDRText, setTLDRText] = useState(null);
    const [expandData, setExpandData] = useState(null)
    const [urls, set_urls] = useState([]);
    const { ens, contest_hash } = useParams();
    const handleClose = () => {
        setTLDRImage(null);
        setTLDRText(null);
        setExpandData(null);
        setModalOpen(false);
    }


    const handleExpand = async (tldr_img, tldr_text, submission_url) => {
        setTLDRImage(tldr_img);
        setTLDRText(tldr_text);
        let res = await axios.get(submission_url)
        setExpandData(res.data);
        setModalOpen(true);
    }

    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_submissions/${ens}/${contest_hash}`);
            set_urls(res.data)
        })();
    }, [])

    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
            <SubmissionWrap>
                {urls.map((url, index) => {
                    return <Submission url={url._url} index={index} handleExpand={handleExpand} />
                })}
                <ViewSubmissionModal modalOpen={modalOpen} handleClose={handleClose} TLDRImage={TLDRImage} TLDRText={TLDRText} expandData={expandData} />
            </SubmissionWrap>
        </>
    )
}

function Submission({ url, index, handleExpand }) {
    const { ens, contest_hash } = useParams();
    const [tldr_img, set_tldr_img] = useState();
    const [tldr_text, set_tldr_text] = useState();
    const [submission_body, set_submission_body] = useState();

    console.log(url)
    useEffect(() => {
        (async () => {
            let res = await axios.get(url)
            set_tldr_img(res.data.tldr_image)
            set_tldr_text(res.data.tldr_text)
            set_submission_body(res.data.submission_body)
        })();
    }, [])

    return (
        <SubmissionPreviewContainer index={index} onClick={() => handleExpand(tldr_img, tldr_text, submission_body)}>
            <p>{tldr_text}</p>
            <PreviewImage src={tldr_img}></PreviewImage>
            {/*
                <SubmissionContent >
                    <ParseBlocks data={data} />
                </SubmissionContent>
                */}
        </SubmissionPreviewContainer>
    )
}
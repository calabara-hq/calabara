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
import * as WebWorker from '../../../../../app/worker-client.js'
import { useSelector, useDispatch } from 'react-redux';
import { selectLogoCache } from "../../../../org-cards/org-cards-reducer";


const SubmissionWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 30px;
    margin-bottom: 400px;
    background-color: #1e1e1e;
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
    font-size: 15px;
    color: #d3d3d3;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 20px;
    transition: width 0.6s ease-in-out;
    cursor: pointer;

    &:hover {
        transform: scale(1.01);
        transition-duration: 0.5s;
        background-color: #1e1e1e;
    }
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
    const [idToExpand, setIdToExpand] = useState(null);
    const [expandData, setExpandData] = useState(null)
    const [sub_content, set_sub_content] = useState([]);
    const { ens, contest_hash } = useParams();


    const handleClose = () => {
        setIdToExpand(null);
        setTLDRImage(null);
        setTLDRText(null);
        setExpandData(null);
        setModalOpen(false);
    }


    const handleExpand = async (id, tldr_img, tldr_text, submission_body) => {
        setIdToExpand(id)
        setTLDRImage(tldr_img);
        setTLDRText(tldr_text);
        setExpandData(submission_body)
        //let res = await axios.get(submission_url)
        console.log(submission_body)



        //setExpandData(JSON.parse(submission_url));

        setModalOpen(true);
    }

    const fetchAll = async (subs) => {
        console.log('requesting')
        const res = await Promise.all(subs.map(sub => fetch('https://cors-anywhere.herokuapp.com/' + sub._url)))
        const jsons = await Promise.all(res.map(r => r.json()))
        console.log(jsons)
        set_sub_content(jsons)
      }

    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_submissions/${ens}/${contest_hash}`);
            fetchAll(res.data)
        })();
    }, [])

    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
            <SubmissionWrap>
                <Submissions sub_content={sub_content} />
                <ViewSubmissionModal modalOpen={modalOpen} handleClose={handleClose} id={idToExpand} TLDRImage={TLDRImage} TLDRText={TLDRText} expandData={expandData} />
            </SubmissionWrap>
        </>
    )
}

function Submissions({ sub_content/*id, url, handleExpand*/ }) {
    const { ens, contest_hash } = useParams();
    const [tldr_img, set_tldr_img] = useState();
    const [tldr_text, set_tldr_text] = useState();
    const [submission_body, set_submission_body] = useState();
    //const logoCache = useSelector(selectLogoCache);
    const dispatch = useDispatch();


    useEffect(() => {



        (async () => {




        })();


        return () => {
        }
    }, [])


    return (
        <WebWorker.ProcessSubmissions subs={sub_content} />
    )
}

/*
      < SubmissionPreviewContainer data-url={sub._url} key={index} /*onClick={() => handleExpand(id, tldr_img, tldr_text, submission_body)} >
      <p></p>
      <PreviewImage></PreviewImage>
    </SubmissionPreviewContainer>
*/
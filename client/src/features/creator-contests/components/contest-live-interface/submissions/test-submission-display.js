import React, { useState, useEffect, useRef } from 'react';
import { contest_data } from '../temp-data';
import styled, { keyframes, css } from 'styled-components'
import { ParseBlocks } from '../block-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { fade_in, TagType } from '../../common/common_styles';
import ExpandSubmissionDrawer from './expand-submission-drawer';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import * as WebWorker from '../../../../../app/worker-client.js'
import { useSelector, useDispatch } from 'react-redux';
import { selectLogoCache } from "../../../../org-cards/org-cards-reducer";
import LazyLoad from 'react-lazyload';
import { CSSTransitionGroup } from 'react-transition-group';
import './spinner.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';


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
    justify-content: space-evenly;
    font-size: 15px;
    color: #d3d3d3;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 20px;
    transition: width 0.6s ease-in-out;
    height: 24em;
    cursor: pointer;

    > div {
        height: 100%;
    }
    
    > div > span > span {
        display: flex !important;
        flex-direction: column;
        height: 90%;
        justify-content: center;
    }


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
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [TLDRImage, setTLDRImage] = useState(null);
    const [TLDRText, setTLDRText] = useState(null);
    const [idToExpand, setIdToExpand] = useState(null);
    const [expandData, setExpandData] = useState(null)
    const [sub_content, set_sub_content] = useState([]);
    const [subs, set_subs] = useState([]);
    const { ens, contest_hash } = useParams();


    const handleClose = () => {
        setIdToExpand(null);
        setTLDRImage(null);
        setTLDRText(null);
        setExpandData(null);
        setDrawerOpen(false);
        document.body.style.overflow = 'unset';

    }


    const handleExpand = async (id, tldr_img, tldr_text, submission_body) => {
        setIdToExpand(id)
        setTLDRImage(tldr_img);
        setTLDRText(tldr_text);
        setExpandData(submission_body)
        setDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }


    useEffect(() => {
        fetch(`/creator_contests/fetch_submissions/${ens}/${contest_hash}`)
            .then(res => res.json())
            .then(data => set_subs(data))
    }, [])


    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
            <SubmissionWrap>

                {subs.map((sub, index) => {
                    return (
                        <Submission sub={sub} handleExpand={handleExpand} />
                    )
                })}

                <ExpandSubmissionDrawer drawerOpen={drawerOpen} handleClose={handleClose} id={idToExpand} TLDRImage={TLDRImage} TLDRText={TLDRText} expandData={expandData} />
            </SubmissionWrap>
        </>
    )
}

const SubmissionTop = styled.div`
    display: flex;
`

const SpanDiv = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    grid-gap: 10px;


`

const Author = styled.span`
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    padding: 0px 3px;

    > p{
        margin: 0;
        color: #4d4d4d;
    }
`

const VoteTotals = styled.span`
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    padding: 0px 3px;
 
    > p{
        margin: 0;
        color: #4d4d4d;
    }
`

const AuthorVotes = styled.span`

    border: 2px solid #4d4d4d;
    border-radius: 10px;
    padding: 0px 3px;

    > p{
        margin: 0;
        color: #4d4d4d;
    }



`

function Submission({ sub, handleExpand }) {
    const { ens, contest_hash } = useParams();
    const [tldr_img, set_tldr_img] = useState();
    const [tldr_text, set_tldr_text] = useState();
    const [submission_body, set_submission_body] = useState();
    const [inViewLength, setInViewLength] = useState(10);
    //const logoCache = useSelector(selectLogoCache);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('setting view for item ', sub.id)
        fetch(sub._url).then(res => {
            res.json().then(json => {
                console.log(json)
                set_tldr_img(json.tldr_image)
                set_tldr_text(json.tldr_text)
                set_submission_body(json.submission_body)
            })

        })



    }, [])

    return (
        <SubmissionPreviewContainer onClick={() => handleExpand(sub.id, tldr_img, tldr_text, submission_body)}>
            <LazyLoad key={sub.id} throttle={200} height={500}
                placeholder={<Placeholder />} debounce={500}>
                <CSSTransitionGroup
                    transitionName="fade"
                    transitionAppear
                    transitionAppearTimeout={900}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <SubmissionTop>
                        <SpanDiv>
                        <Author><p>nick.eth</p></Author>
                        <VoteTotals><p>40 total votes</p></VoteTotals>
                        <AuthorVotes><p>5 votes</p></AuthorVotes>
                    </SpanDiv>
                </SubmissionTop>
                <p>{tldr_text}</p>
                <LazyLoadImage style={{ maxWidth: '15em', margin: '0 auto', borderRadius: '10px' }} src={tldr_img} effect="blur" />
            </CSSTransitionGroup>
        </LazyLoad>
        </SubmissionPreviewContainer >


    )
}


function Placeholder() {
    return (
        <div className="placeholder">
            <div className="spinner">
                <div className="rect1"></div>
                <div className="rect2"></div>
                <div className="rect3"></div>
                <div className="rect4"></div>
                <div className="rect5"></div>
            </div>
        </div>
    );
}

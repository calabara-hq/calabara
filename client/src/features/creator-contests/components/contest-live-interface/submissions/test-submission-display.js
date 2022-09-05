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
import { Placeholder } from '../../common/common_components';
//import { io } from "socket.io-client";
//const socket = io();


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

    margin: -10px -10px 30px -10px;
`

const SubmissionPreviewContainer = styled.div`
    //display: flex;
    flex: 0 1 30%;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 16px;
    color: #d3d3d3;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 20px;
    transition: width 0.6s ease-in-out;
    height: 24em;
    margin: 10px;
    cursor: pointer;
    overflow: hidden;

    // TURTLES need to set this up to wrap submission containers properly
    @media(max-width: 1720px){
        flex: 1 1 28%;
    }
    
    

    > div {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    > div > span {
        height: 100%;
        display: flex;
        flex-direction: column;

    }


    &:hover {
        transform: scale(1.01);
        transition-duration: 0.5s;
        background-color: #1e1e1e;
    }
`
const LazyStyledImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`


export default function SubmissionDisplay({ }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [TLDRImage, setTLDRImage] = useState(null);
    const [TLDRText, setTLDRText] = useState(null);
    const [idToExpand, setIdToExpand] = useState(null);
    const [expandData, setExpandData] = useState(null);
    const [author, setAuthor] = useState(null);
    const [sub_content, set_sub_content] = useState([]);
    const [subs, set_subs] = useState([]);
    const { ens, contest_hash } = useParams();

    console.log('re rendering')

    const handleClose = () => {
        setIdToExpand(null);
        setTLDRImage(null);
        setTLDRText(null);
        setExpandData(null);
        setDrawerOpen(false);
        document.body.style.overflow = 'unset';

    }


    const handleExpand = async (id, tldr_img, tldr_text, submission_body, author) => {
        setIdToExpand(id)
        setTLDRImage(tldr_img);
        setTLDRText(tldr_text);
        setExpandData(submission_body);
        console.log(author)
        setAuthor(author);
        setDrawerOpen(true);
        document.body.style.overflow = 'hidden';
    }


    useEffect(() => {

        console.log('connecting to socket')

        fetch(`/creator_contests/fetch_submissions/${ens}/${contest_hash}`)
            .then(res => res.json())
            .then(data => set_subs(data))

        /*
    socket.on('connect', () => {
        console.log('connected to websocket')
    })

    socket.on('disconnect', () => {
        console.log('disconnected from socket')
    })

    return () => {
        socket.off('connect')
        socket.off('disconnect')
    }
    */
    }, [])
    /*
        useEffect(() => {
    
            const submissionListener = (submission) => {
                console.log(submission)
                set_subs((prev_subs) => {
                    const new_subs = [...prev_subs]
                    new_subs.push(submission);
                    return new_subs
                })
            }
    
            socket.on('new_submission', submissionListener)
        }, [socket])
    */

    return (
        <div>
            {subs.length > 0 &&
                <>
                    <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
                    <SubmissionWrap>

                        {subs.map((sub, index) => {
                            return (
                                <Submission sub={sub} handleExpand={handleExpand} />
                            )
                        })}

                        <ExpandSubmissionDrawer drawerOpen={drawerOpen} handleClose={handleClose} id={idToExpand} TLDRImage={TLDRImage} TLDRText={TLDRText} expandData={expandData} author={author} />
                    </SubmissionWrap>
                </>
            }
        </div>
    )
}

const SubmissionTop = styled.div`
    display: flex;
`

const SpanDiv = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-top: auto;
    grid-gap: 10px;


`

const Author = styled.span`
    //border: 2px solid #4d4d4d;
    //border-radius: 10px;
    padding: 0px 3px;
    color: #f2f2f2;
    background-image: linear-gradient(#262626, #262626),linear-gradient(90deg,#e00f8e,#2d66dc);
    background-origin: border-box;
    background-clip: padding-box,border-box;
    border: 2px double transparent;
    border-radius: 4px;
    //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    > p{
        margin: 0;
        color: #d9d9d9;
    }
`

const VoteTotals = styled.span`
    color: rgb(211,151,39);
    background-color: #1e1e1e;
    border: 2px solid rgb(211,151,39);
    border-radius: 4px;
    //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 0px 5px;



 
    > p{
        margin: 0;
        //color: #d3d3d3;
    }
`

const AuthorVotes = styled.span`

    //border: 2px solid #4d4d4d;
    //border-radius: 10px;
    //padding: 0px 3px;
    color: rgb(211,151,39);
    background-color: #1e1e1e;
    border: 2px solid rgb(211,151,39, .3);
    border-radius: 4px;
    //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);


    > p{
        margin: 0;
        color: #4d4d4d;
    }



`

function Submission({ sub, handleExpand }) {
    const [tldr_img, set_tldr_img] = useState(null);
    const [tldr_text, set_tldr_text] = useState(null);
    const [submission_body, set_submission_body] = useState(null);
    const { ens, contest_hash } = useParams();



    useEffect(() => {
        console.log('setting view for item ', sub.id)
        fetch(sub._url).then(res => {
            res.json().then(json => {
                set_tldr_img(json.tldr_image)
                set_tldr_text(json.tldr_text)
                set_submission_body(json.submission_body)
            })
        })


        /*
        TURTLES come back and implement vote streaming
        fetch(`/creator_contests/fetch_submission_votes?ens=${ens}&contest_hash=${contest_hash}&sub_id=${sub.id}`)
        .then(res => res.json())
        .then(json => {console.log(json)})
        */
    }, [])

    return (
        <SubmissionPreviewContainer onClick={() => handleExpand(sub.id, tldr_img, tldr_text, submission_body, sub.author)}>
            <LazyLoad key={sub.id} throttle={200} height={500}
                placeholder={<Placeholder />} debounce={500}>
                <CSSTransitionGroup
                    transitionName="fade"
                    transitionAppear
                    transitionAppearTimeout={900}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <p>{tldr_text}</p>
                    <LazyStyledImage>
                        <LazyLoadImage style={{ maxWidth: '12em', margin: '0 auto', borderRadius: '10px' }} src={tldr_img} effect="blur" />
                    </LazyStyledImage>

                </CSSTransitionGroup>
            </LazyLoad>
            <SubmissionTop>
                {/*
                <SpanDiv>
                    {sub.votes && <VoteTotals><p>{sub.votes} votes</p></VoteTotals>}
                </SpanDiv>
        */}
            </SubmissionTop>
        </SubmissionPreviewContainer >


    )
}


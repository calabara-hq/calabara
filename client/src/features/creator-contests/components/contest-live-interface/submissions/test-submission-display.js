import React, { useState, useEffect, useRef, Suspense } from 'react';
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
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Placeholder from '../../common/spinner';
import { socket } from '../../service/socket';
import { selectContestState } from '../interface/contest-interface-reducer';
import fetchSubmission from './submission-data-fetch';
import DisplayWinners from '../winners/contest-winners';


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


const uniqueRankStyles =
    [
        `border: 2px solid #DAA520;

    `,
        `border: 2px solid blue;
    `
        ,
        `border: 2px solid blue;
    `
    ]


const SubmissionsHeading = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        > div {
            text-align: center;
            flex: 1;
        }
    `


const SubmissionPreviewContainer = styled.div`
    //display: flex;
    position: relative;
    flex: 0 1 30%;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-around;
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
    max-width: 30%;
    cursor: pointer;
    ${props => (props.contest_rank && props.contest_rank < 2) ? css`${uniqueRankStyles[props.contest_rank - 1]}` : ''}


    &::before{
        display: inline-block;
        content: '${props => props.contest_rank === 1 ? "\f521" : ""}';
        color: #DAA520;
        position: absolute;
        //background-color: red;
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        font-size: 30px;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        

    }



    > div {
        display: flex;
        flex-direction: column;
        word-wrap: break-word;
    }
    
    > div > span {
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
    text-align: center;
    overflow: hidden;
`



export default function SubmissionDisplay({ }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [TLDRImage, setTLDRImage] = useState(null);
    const [TLDRText, setTLDRText] = useState(null);
    const [idToExpand, setIdToExpand] = useState(null);
    const [expandData, setExpandData] = useState(null);
    const [author, setAuthor] = useState(null);
    const [subs, set_subs] = useState([]);
    const { ens, contest_hash } = useParams();
    const contest_state = useSelector(selectContestState);


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

        setAuthor(author);
        setDrawerOpen(true);
        document.body.style.overflow = 'hidden';
    }



    useEffect(() => {
        if (contest_state < 2) {
            fetch(`/creator_contests/fetch_submissions/${ens}/${contest_hash}`)
                .then(res => res.json())
                .then(data => set_subs(data))
        }

        else if (contest_state === 2) {
            // get the winners
            console.log('we are here')
            fetch(`/creator_contests/fetch_contest_winners/?ens=${ens}&contest_hash=${contest_hash}`)
                .then(res => res.json())
                .then(data => set_subs(data))
        }

    }, [])

    useEffect(() => {
        console.log('socket update!!!')

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

    return (
        <div>
            {subs.length > 0 &&
                <>
                    <SubmissionsHeading>
                        <div>
                            <h2 style={{ color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
                        </div>
                        <DisplayWinners />
                    </SubmissionsHeading>
                    <SubmissionWrap>

                        {subs.map((sub, index) => {
                            let fetched_submission = fetchSubmission(sub._url)
                            return (
                                <Submission sub={sub} index={index} handleExpand={handleExpand} />
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

function Submission({ sub, handleExpand, index, fetched_submission }) {
    const [tldr_img, set_tldr_img] = useState(null);
    const [tldr_text, set_tldr_text] = useState(null);
    const [submission_body, set_submission_body] = useState(null);
    const [rank, setRank] = useState(null);
    const contest_state = useSelector(selectContestState)




    useEffect(() => {
        fetch(sub._url).then(res => {
            res.json().then(json => {
                console.log(json)
                set_tldr_img(json.tldr_image)
                set_tldr_text(json.tldr_text)
                set_submission_body(json.submission_body)
                if (contest_state === 2) {
                    setRank(index + 1)
                }

            })
        })

    }, [])





    return (

        <SubmissionPreviewContainer onClick={() => handleExpand(sub.id, tldr_img, tldr_text, submission_body, sub.author)} contest_rank={rank}>
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
            </SubmissionTop>
        </SubmissionPreviewContainer >
    )
}


import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { socket } from '../../../../../../service/socket';
import { selectContestState } from '../../interface/contest-interface-reducer';
import ExpandSubmissionDrawer from './expand-submission-drawer';
import { Author, SubmissionBottomBlur, SubmissionMeta, VoteTotals } from './submission-display-styles';


const SubmissionWrap = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    overflow: wrap;
    margin: -10px;

    @media screen and (max-width: 1115px){
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (max-width: 720px){
        grid-template-columns: 1fr;
    }


    margin-bottom: 400px;
    background-color: #1e1e1e;
    padding: 10px;
    border: none;
    border-radius: 10px;
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



const SubmissionPreviewContainer = styled.div`
    margin: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    font-size: 16px;
    color: #d3d3d3;
    cursor: pointer;
    height: 26em;
    margin: 10px;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 20px;
    ${props => (props.contest_rank && props.contest_rank < 2) ? css`${uniqueRankStyles[props.contest_rank - 1]}` : ''}

    &::before{
        display: inline-block;
        content: '${props => props.contest_rank === 1 ? "\f521" : ""}';
        color: #DAA520;
        position: absolute;
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        font-size: 30px;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
    }
    &:hover {
        transform: scale(1.01);
        background-color: #1e1e1e;
    }
`


const LazyStyledImage = styled.div`
    text-align: center;
    justify-self: center;
    margin-top: auto;
    margin-bottom: auto;
`

const SubmissionHeading = styled.div`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 20px;
        > h2 {
            text-align: center;
        }
        @media screen and (max-width: 408px){
            justify-content: center;
        }
    `


const CreateSubmissionButton = styled.button`
    margin-left: auto;
    font-size: 15px;
    border: 2px solid #539bf5;
    border-radius: 10px;
    background-color: #1e1e1e;
    color: #d3d3d3;
    padding: 10px 15px;
    &:active{
        transform: scale(0.9);
    }
    @media screen and (max-width: 408px){
        margin-left: 0;
    }

`

export default function SubmissionDisplay({ }) {
    const { ens, contest_hash } = useParams();
    const contest_state = useSelector(selectContestState);
    const [subs, set_subs] = useState([]);

    useEffect(() => {
        fetch(`/creator_contests/fetch_submissions/?ens=${ens}&contest_hash=${contest_hash}`)
            .then(res => res.json())
            .then(data => set_subs(data))
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
            <SubmissionHeading>
                <h2 style={{ color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
            </SubmissionHeading >
            {subs.length > 0 &&
                <SubmissionWrap>
                    < MapSubmissions subs={subs} />
                </SubmissionWrap>
            }
        </div >
    )
}

function MapSubmissions({ subs }) {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [TLDRImage, setTLDRImage] = useState(null);
    const [TLDRText, setTLDRText] = useState(null);
    const [idToExpand, setIdToExpand] = useState(null);
    const [expandData, setExpandData] = useState(null);
    const [author, setAuthor] = useState(null);
    const [votes, setVotes] = useState(null);



    const handleClose = () => {
        setIdToExpand(null);
        setTLDRImage(null);
        setTLDRText(null);
        setExpandData(null);
        setDrawerOpen(false);
        document.body.style.overflow = 'unset';

    }


    const handleExpand = async (id, tldr_img, tldr_text, submission_body, author, votes) => {
        setIdToExpand(id)
        setTLDRImage(tldr_img);
        setTLDRText(tldr_text);
        setExpandData(submission_body);
        setVotes(votes)
        setAuthor(author);
        setDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }




    return (
        <>
            {subs.map((sub, index) => {
                return (
                    <LazyLoadedSubmission key={index} sub={sub} handleExpand={handleExpand} index={index} />
                )
            })}
            <ExpandSubmissionDrawer drawerOpen={drawerOpen} handleClose={handleClose} id={idToExpand} TLDRImage={TLDRImage} TLDRText={TLDRText} expandData={expandData} author={author} votes={votes} />
        </>
    )
}

function LazyLoadedSubmission({ sub, handleExpand, index }) {
    const [tldr_img, set_tldr_img] = useState(null);
    const [tldr_text, set_tldr_text] = useState(null);
    const [submission_body, set_submission_body] = useState(null);
    const [rank, setRank] = useState(null);
    const contest_state = useSelector(selectContestState)
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleClose = () => {

        setDrawerOpen(false);
        document.body.style.overflow = 'unset';

    }



    useEffect(() => {
        fetch(sub._url).then(res => {
            res.json().then(json => {
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

        <SubmissionPreviewContainer onClick={() => handleExpand(sub.id, tldr_img, tldr_text, submission_body, sub.author, sub.votes)} contest_rank={rank}>
            <p>{tldr_text}</p>
            <LazyStyledImage>
                <LazyLoadImage style={{ maxWidth: '15em', maxHeight: '15em', margin: '0 auto', borderRadius: '10px' }} src={tldr_img} effect="blur" />
            </LazyStyledImage>
            <SubmissionBottomBlur>
                <SubmissionMetadata contest_state={contest_state} sub={sub} />
            </SubmissionBottomBlur>
        </SubmissionPreviewContainer >

    )
}


function SubmissionMetadata({ contest_state, sub }) {
    return (
        <SubmissionMeta width={'98%'}>
            {typeof sub.author !== 'undefined' ? <Author>{sub.author.substring(0, 6)}...{sub.author.substring(38, 42)}</Author> : null}
            {typeof sub.votes !== 'undefined' ? <VoteTotals>{sub.votes} votes</VoteTotals> : null}
        </SubmissionMeta>
    )
    return null
}





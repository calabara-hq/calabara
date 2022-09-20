import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components'
import ExpandSubmissionDrawer from './expand-submission-drawer';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { socket } from '../../service/socket';
import { selectContestState } from '../interface/contest-interface-reducer';
import { fetchSubmission } from './submission-data-fetch';
import DisplayWinners from '../winners/contest-winners';
import { ContestPromptDrawer } from '../prompts/prompt-display';
import { VoteTotals, SubmissionMeta, Author } from './submission-styles';


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
        align-items: center;
        justify-content: flex-start;
        position: relative;
        flex-wrap: wrap;
        > div {
            text-align: left;
            flex: 1;
        }
    `




export default function SubmissionDisplay({ }) {
    const { ens, contest_hash } = useParams();
    const contest_state = useSelector(selectContestState);
    const [subs, set_subs] = useState([]);



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
    console.log(subs)

    if (subs.length === 0) {
        return (
            <div>
                <SubmissionHeading>
                    <div>
                        <h2 style={{ color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
                    </div>
                    <DisplayWinners />
                    <CreateSubmission />
                </SubmissionHeading >
            </div >
        )
    }

    return (
        <div>
            <SubmissionHeading>
                <div>
                    <h2 style={{ color: '#d3d3d3', marginBottom: '30px' }}>Submissions</h2>
                </div>
                <DisplayWinners />
                <CreateSubmission />
            </SubmissionHeading>
            <SubmissionWrap>
                < MapSubmissions subs={subs} />
                {/*<ExpandSubmissionDrawer drawerOpen={drawerOpen} handleClose={handleClose} id={idToExpand} TLDRImage={TLDRImage} TLDRText={TLDRText} expandData={expandData} author={author} votes={votes} />*/}
            </SubmissionWrap>
        </div>
    )
}


const CreateSubmissionButton = styled.button`
    font-size: 15px;
    position: absolute;
    right: 0;
    border: 2px solid #539bf5;
    background-color: #1a1a1a;
    border-radius: 4px;
    padding: 5px 10px;
    color: #bfbfbf;
    font-weight: bold;
    &:hover{
        background-color: #24262e;
    }

`

function CreateSubmission({ }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const contest_state = useSelector(selectContestState)

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setIsCreating(false);
        document.body.style.overflow = 'unset';

    }
    if (contest_state === 0) return (
        <>
            <CreateSubmissionButton onClick={handleDrawerOpen}>create submission</CreateSubmissionButton>
            <ContestPromptDrawer isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose} isCreating={isCreating} setIsCreating={setIsCreating} />
        </>
    )

    return null
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

        <SubmissionPreviewContainer onClick={() => handleExpand(sub.id, tldr_img, tldr_text, submission_body, sub.author, sub.votes)} contest_rank={rank}>
            <p>{tldr_text}</p>
            <LazyStyledImage>
                <LazyLoadImage style={{ maxWidth: '15em', maxHeight: '15em', margin: '0 auto', borderRadius: '10px' }} src={tldr_img} effect="blur" />
            </LazyStyledImage>
            <SubmissionMetadata contest_state={contest_state} sub={sub} />
        </SubmissionPreviewContainer >

    )
}


function SubmissionMetadata({ contest_state, sub }) {
    if (contest_state === 2) {
        return (
            <SubmissionMeta>
                {sub.author && <Author>{sub.author.substring(0, 6)}...{sub.author.substring(38, 42)}</Author>}
                <VoteTotals>{sub.votes} votes</VoteTotals>
            </SubmissionMeta>
        )
    }
    return null
}





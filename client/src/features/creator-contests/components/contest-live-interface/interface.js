import { contest_data } from "./temp-data";
import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectDashboardInfo } from "../../../dashboard/dashboard-info-reducer";
import { selectLogoCache } from "../../../org-cards/org-cards-reducer";
import useCommon from "../../../hooks/useCommon";
import { useParams } from "react-router-dom";
import * as WebWorker from '../../../../app/worker-client.js'
import moment from "moment";
import { Label } from "../common/common_styles";
import { ContestDurationCheckpointBar } from "../../../checkpoint-bar/checkpoint-bar";
import { Countdown } from "../common/common_components";
import useContestTimekeeper from "../../../hooks/useContestTimekeeper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import SubmissionBuilder from "./submission-builder";
import SubmissionDisplay from "./test-submission-display";
import { ParseBlocks } from "./block-parser";
import SubmissionModal from "./edit-submission-modal";

const ContestInterfaceWrap = styled.div`
    width: 70vw;
    margin: 0 auto;
    border: 1px solid #22272e;
    //background-color: #22272e;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
`

const InterfaceHeading = styled.div`
    display: flex;
    flex-direction: column;
    color: #d3d3d3;
    margin-bottom: 100px;
    margin-top: 20px;
`

const HeadingSection1 = styled.div`
    display: flex;
    color: #d3d3d3;
    width: 85%;
    margin: 0 auto;
`

const OrgImg = styled.img`
    max-width: 15em;
    border: none;
    border-radius: 4px;
`
const ContestDetails = styled.div`
    display: flex;
    flex-direction: column;
    justify-self: center;
    align-self: center;
    margin: 0 auto;
`

const DetailRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 25em;
    justify-content: space-between;
    font-weight: bold;
    text-align: left;
    align-items: center;
    p{
        margin: 0;
        padding: 5px 0;
    }
`

const CheckpointWrap = styled.div`
    margin: 0 auto;
    width: 80%;
    color: #d3d3d3;
    margin-bottom: 1em;

    .RSPBprogressBar > .RSPBstep:nth-child(1)::after {
      text-align: center;
      content: "submit";
      color: rgb(138, 128, 234);
      background-color: rgba(138, 128, 234, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      position: absolute;
      bottom: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(2)::after {
      text-align: center;
      content: "vote";
      color: rgb(211, 151, 39);
      background-color: rgba(211, 151, 39, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      position: absolute;
      bottom: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(3)::after {
      text-align: center;
      content: "end";
      color: rgb(178, 31, 71);
      background-color: rgba(178, 31, 71, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      position: absolute;
      bottom: 2em;
    }
`

const CheckpointBottomTag = styled.p`
    color: ${props => props.status === 'active' ? 'green' : (props.status === 'complete' ? 'grey' : '')};
`

const CheckpointBottom = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 85%;
    color: #d3d3d3;
    margin: 0 auto;
    margin-bottom: 50px;
    font-weight: bold;
    

    ${CheckpointBottomTag}:nth-child(1){
        text-align: left;
    }
    ${CheckpointBottomTag}:nth-child(2){
        text-align: center;
    }
    ${CheckpointBottomTag}:nth-child(3){
        text-align: right;
    }
`


const label_status = [
    { status: 'accepting submissions', text: 'rgb(138, 128, 234)', background: 'rgba(138, 128, 234, 0.3)' },
    { status: 'voting', text: 'rgb(211, 151, 39)', background: 'rgba(211, 151, 39, 0.3)' },
    { status: 'end', text: 'rgb(178, 31, 71)', background: 'rgba(178, 31, 71, 0.3)' }

]


export default function ContestInterface({ }) {
    const [barProgress, setBarProgress] = useState(0);

    const { ens } = useParams();
    const [isInfoLoaded, setIsInfoLoaded] = useState(false)
    const dispatch = useDispatch();
    const { durations, calculateActive } = useContestTimekeeper(setBarProgress, contest_data.date_times.start_date, contest_data.date_times.voting_begin, contest_data.date_times.end_date);

    // initialize dashboard info
    const info = useSelector(selectDashboardInfo)
    const { batchFetchDashboardData } = useCommon();
    const logoCache = useSelector(selectLogoCache);

    useEffect(() => {
        batchFetchDashboardData(ens, info);
        console.log(info)
    }, [info])


    useEffect(() => {
        if (info.ens == ens && !isInfoLoaded) {
            setIsInfoLoaded(true)
        }
    }, [info])


    useEffect(() => {
        WebWorker.processImages(dispatch, logoCache);
    }, [isInfoLoaded])

    const calculateRewardsSum = () => {
        let [erc20_sum, erc721_sum, eth_sum] = [0, 0, 0];


        Object.values(contest_data.submitter_rewards).map((reward) => {
            if (reward['erc20']) erc20_sum += reward['erc20']
            if (reward['erc721']) erc721_sum += reward['erc721']
            if (reward['eth']) eth_sum += reward['eth']
        })

        // TURTLES. Not working now because voter / submitter are not similar format
        Object.values(contest_data.voter_rewards).map((reward) => {
            if (reward['erc20']) erc20_sum += reward['erc20']
            if (reward['erc721']) erc721_sum += reward['erc721']
            if (reward['eth']) eth_sum += reward['eth']
        })

        return [
            { sum: erc20_sum, symbol: contest_data.reward_options['erc20'] },
            { sum: 3, symbol: 'NOUN' },//contest_data.reward_options['erc721'] },
            { sum: eth_sum, symbol: 'ETH' },
        ]
    }

    console.log(calculateRewardsSum());

    let end_date = moment.utc(contest_data.date_times.end_date).local().format('ddd. M/D hh:mm A').toString()
    let rewards_sum = calculateRewardsSum();

    const [mode, setMode] = useState(true);
    const [isSubmissionBuilder, setIsSubmissionBuilder] = useState(false);

    return (
        <ContestInterfaceWrap>
            <InterfaceHeading>
                <HeadingSection1>
                    <OrgImg data-src={info.logo}></OrgImg>
                    <ContestDetails>
                        <DetailRow>
                            <p>Ends:</p>
                            <p>{end_date}</p>
                        </DetailRow>
                        <DetailRow>
                            <p>Status:</p>
                            <Label color={label_status[calculateActive()]}>{label_status[calculateActive()].status}</Label>
                        </DetailRow>
                        {rewards_sum.map((reward, index) => {
                            if (reward.sum > 0) return (
                                <DetailRow>
                                    {index === 0 ? <p>Rewards:</p> : <b></b>}
                                    <p>{reward.sum} {reward.symbol}</p>
                                </DetailRow>
                            )
                        })}
                        <DetailRow>
                            <p>Voter Rewards:</p>
                            <FontAwesomeIcon style={{ fontSize: '1.5em', color: Object.keys(contest_data.voter_rewards).length > 0 ? '#00a368' : 'red' }} icon={Object.keys(contest_data.voter_rewards).length > 0 ? faCheckCircle : faTimesCircle} />
                        </DetailRow>

                    </ContestDetails>
                </HeadingSection1>
            </InterfaceHeading>
            <CheckpointWrap>
                <ContestDurationCheckpointBar percent={barProgress} />
            </CheckpointWrap>
            <CheckpointBottom>
                {durations.map((duration, index) => {
                    return (
                        <CheckpointBottomTag status={duration}>{duration}</CheckpointBottomTag>
                    )
                })}
            </CheckpointBottom>
            <PromptDisplay setIsSubmissionBuilder={setIsSubmissionBuilder} />
            {isSubmissionBuilder && <SubmissionBuilder setIsSubmissionBuilder={setIsSubmissionBuilder} />}
            <SubmissionDisplay />
        </ContestInterfaceWrap>
    )
}

const PromptContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #1d1d1d;
    padding: 10px;
    border: none;
    border-radius: 10px;
`

const CollapsiblePrompt = styled.div`
    display: flex;
    flex-direction: column;
    width: '100%';
    justify-content: center;
    align-items: flex-start;
    grid-gap: 20px;
    border: 2px solid black;
    border-radius: 4px;
    background-color: #1c2128;
    color: #d3d3d3;
    padding: 5px;
    cursor: pointer;
    margin-bottom: 10px;
`

const PromptTop = styled.div`
    display: flex;
    align-items: center;
    width: 100%;

    & ${Label}{
        margin-left: auto;
        margin-right: 5px;
    }
`

const PromptContent = styled.div`
    display: flex;
    flex-direction: column;
    max-height: ${props => props.isOpen ? '150px' : '0px'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    width: 100%;
`


const labelColorOptions = [
    { text: 'transparent', background: 'transparent' },
    { text: 'rgb(234, 203, 195)', background: 'rgba(234, 203, 195,0.3)' },
    { text: 'rgb(162, 114, 141)', background: 'rgba(162, 114, 141, 0.3)' },
    { text: 'rgb(104, 160, 170)', background: 'rgba(104, 160, 170, 0.3)' },
    { text: 'rgb(111, 208, 140)', background: 'rgba(111, 208, 140, 0.3)' },
]

const NewSubmissionButton = styled.button`
    width: 10em;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    margin-left: auto;
    margin-right: 5px;
    margin-top: 2em;
    margin-bottom: 2em;
    color: black;
    background-color: #00a368;
`


function PromptDisplay({ setIsSubmissionBuilder }) {
    const [openPromptIndex, setOpenPromptIndex] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenPrompt = (index) => {
        if (openPromptIndex === index) return setOpenPromptIndex(-1)
        return setOpenPromptIndex(index)
    }


    const handleSubmissionClose = async (cleanup) => {
        if (cleanup.type === 'standard') {
            setModalOpen(false);
        }
    }

    const handleSubmissionOpen = async () => {
        setModalOpen(true)
    }

    const handlePromptClick = (e, index) => {
        if (openPromptIndex === index) {
            setOpenPromptIndex(-1);
            setIsSubmissionBuilder(false);
            e.stopPropagation();
        }
        else {
            setOpenPromptIndex(index)
        }
    }

    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: '30px' }}>Prompts</h2>
            <PromptContainer>
                {contest_data.prompts.map((prompt, index) => {
                    return (
                        <CollapsiblePrompt onClick={(e) => handlePromptClick(e, index)} isOpen={openPromptIndex === index}>
                            <PromptTop>
                                <h4>{prompt.title}</h4>
                                <Label color={labelColorOptions[prompt.label.color]}>{prompt.label.name}</Label>
                            </PromptTop>
                            <PromptContent isOpen={openPromptIndex === index}>
                                <ParseBlocks data={prompt} />
                                <NewSubmissionButton onClick={handleSubmissionOpen}>Create Submission</NewSubmissionButton>
                                {modalOpen && <SubmissionModal modalOpen={modalOpen} handleClose={handleSubmissionClose} selectedPrompt={prompt} />}
                            </PromptContent>
                        </CollapsiblePrompt>
                    )
                })}
            </PromptContainer>
        </>
    )
}
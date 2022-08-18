import React, { useState } from 'react'
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ContestInfo from "../contest_info/contest-info";
import useContestState from "../../../../hooks/useContestState";
import PromptDisplay from '../prompts/prompt-display';
import SubmissionBuilder from '../submissions/submission-builder-3'
import SubmissionDisplay from '../submissions/test-submission-display2';
import { useDispatch, useSelector } from "react-redux";
import { ContestDurationCheckpointBar } from "../../../../checkpoint-bar/checkpoint-bar";
import { selectProgressRatio, selectDurations } from './contest-interface-reducer';
import { InterfaceHeading, HeadingSection1, OrgImg, ContestDetails, DetailRow, CheckpointWrap, CheckpointBottomTag, CheckpointBottom, label_status } from '../contest_info/contest-info-style';

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
const ContestInterSplit = styled.div`
    display: flex;




`

const InfoRender = styled.div`
    display: flex;
    flex-direction: column;



`




export default function ContestInterface({ contest_settings }) {
    const { ens } = useParams();
    const [isSubmissionBuilder, setIsSubmissionBuilder] = useState(false);
    const [createSubmissionIndex, setCreateSubmissionIndex] = useState(-1);

    /*
    const stateManager = useContestState(
        contest_settings.date_times.start_date,
        contest_settings.date_times.voting_begin,
        contest_settings.date_times.end_date
    );
    */
    let t0 = new Date();
    let t1 = new Date();
    let t2 = new Date();

    t1.setSeconds(t1.getSeconds() + 120)
    t2.setSeconds(t2.getSeconds() + 299)


    const stateManager = useContestState(
        t0.toISOString(),
        t1.toISOString(),
        t2.toISOString(),

    )


    return (
        <ContestInterfaceWrap>
            <ContestInterSplit>
                <InfoRender>
                    {contest_settings && <ContestInfo contest_settings={contest_settings} />}
                    <RenderCheckpoint />
                </InfoRender>
            <PromptDisplay setIsSubmissionBuilder={setIsSubmissionBuilder} createSubmissionIndex={createSubmissionIndex} setCreateSubmissionIndex={setCreateSubmissionIndex}/>
            </ContestInterSplit>
            {isSubmissionBuilder && <SubmissionBuilder setIsSubmissionBuilder={setIsSubmissionBuilder} setCreateSubmissionIndex={setCreateSubmissionIndex}/>}
            {!isSubmissionBuilder && <SubmissionDisplay />}
        </ContestInterfaceWrap>
    )
}


function RenderCheckpoint() {
    const barProgress = useSelector(selectProgressRatio);
    const durations = useSelector(selectDurations);

    return (
        <>
            <CheckpointWrap>
                <ContestDurationCheckpointBar percent={barProgress} />
            </CheckpointWrap>
            <CheckpointBottom>
                {durations.map((duration, index) => {
                    return (
                        <CheckpointBottomTag key={index} status={duration}>{duration}</CheckpointBottomTag>
                    )
                })}
            </CheckpointBottom>
        </>
    )
}
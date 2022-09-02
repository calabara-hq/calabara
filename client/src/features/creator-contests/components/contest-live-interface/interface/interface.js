import React, { useState, useEffect, useRef } from 'react'
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ContestInfo from "../contest_info/contest-info";
import useContestState from "../../../../hooks/useContestState";
import PromptDisplay from '../prompts/prompt-display-2';
import SubmissionBuilder from '../submissions/submission-builder'
import SubmissionDisplay from '../submissions/test-submission-display2';
import { useDispatch, useSelector } from "react-redux";
import { ContestDurationCheckpointBar } from "../../../../checkpoint-bar/checkpoint-bar";
import { selectProgressRatio, selectDurations } from './contest-interface-reducer';
import { InterfaceHeading, HeadingSection1, OrgImg, ContestDetails, DetailRow, CheckpointWrap, CheckpointBottomTag, CheckpointBottom, label_status } from '../contest_info/contest-info-style';
import { selectDashboardInfo } from "../../../../dashboard/dashboard-info-reducer";
import { selectLogoCache } from "../../../../org-cards/org-cards-reducer";
import useCommon from "../../../../hooks/useCommon";
import { Contest_h2_alt } from '../../common/common_styles';
import * as WebWorker from '../../../../../app/worker-client.js'

const ContestInterfaceWrap = styled.div`
    width: 70vw;
    margin: 0 auto;
    //border: 1px solid #22272e;
    //background-color: #22272e;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
`
const ContestInterSplit = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    




 `



const PromptRight = styled.div`
    display: flex;
    width: 70%;




`




const ImgWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    //height: 100%;
    width: 30%;
    margin: auto;



`




export default function ContestInterface({ contest_settings }) {
    const { ens } = useParams();
    const [isSubmissionBuilder, setIsSubmissionBuilder] = useState(false);
    const [createSubmissionIndex, setCreateSubmissionIndex] = useState(-1);
    const info = useSelector(selectDashboardInfo)
    const { batchFetchDashboardData } = useCommon();
    const logoCache = useSelector(selectLogoCache);
    const dispatch = useDispatch()
    const [isInfoLoaded, setIsInfoLoaded] = useState(false);
    const builderScroll = useRef(null)

    const stateManager = useContestState(
        contest_settings.date_times.start_date,
        contest_settings.date_times.voting_begin,
        contest_settings.date_times.end_date,

    )

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

    useEffect(() => {
        if (isSubmissionBuilder) {
            builderScroll.current.scrollIntoView({ behavior: 'smooth' });
        }

    }, [isSubmissionBuilder])


    return (
        <ContestInterfaceWrap>
            <ContestInterSplit>
                <ImgWrap>
                    <OrgImg data-src={info.logo}></OrgImg>
                    <Contest_h2_alt>{info.name}</Contest_h2_alt>
                </ImgWrap>
                <PromptRight>
                    <PromptDisplay contest_settings={contest_settings} setIsSubmissionBuilder={setIsSubmissionBuilder} createSubmissionIndex={createSubmissionIndex} setCreateSubmissionIndex={setCreateSubmissionIndex} />
                </PromptRight>
            </ContestInterSplit>
            {contest_settings && <ContestInfo contest_settings={contest_settings} />}
            <RenderCheckpoint />
            <div ref={builderScroll} >
                {isSubmissionBuilder && <SubmissionBuilder setIsSubmissionBuilder={setIsSubmissionBuilder} setCreateSubmissionIndex={setCreateSubmissionIndex} />}
            </div>
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
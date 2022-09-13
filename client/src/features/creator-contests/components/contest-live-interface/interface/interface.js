import React, { useState, useEffect, useRef, Suspense } from 'react'
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ContestInfo from "../contest_info/contest-info";
import PromptDisplay from '../prompts/prompt-display';
import SubmissionBuilder from '../submissions/submission-builder'
//import SubmissionDisplay from '../submissions/test-submission-display';
import { useDispatch, useSelector } from "react-redux";
import { ContestDurationCheckpointBar, ContestSubmissionCheckpointFallback } from "../../../../checkpoint-bar/checkpoint-bar";
import { CheckpointWrap, CheckpointTop, CheckpointBottomTag, CheckpointBottom } from '../contest_info/contest-info-style';
import { selectDashboardInfo } from "../../../../dashboard/dashboard-info-reducer";
import { selectLogoCache } from "../../../../org-cards/org-cards-reducer";
import useCommon from "../../../../hooks/useCommon";
import { Contest_h2_alt, fade_in } from '../../common/common_styles';
import BackButton from '../../../../back-button/back-button';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SubmissionDisplay from '../submissions/test-submission-display';
import { selectDurations, selectProgressRatio, selectContestState } from './contest-interface-reducer';
import Placeholder from '../../common/spinner';

const ContestInterfaceWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 70vw;
    margin: 0 auto;

`
const InterfaceTopSplit = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: -10px;
    flex-wrap: wrap;
    margin-bottom: 10px;
    > * {
        margin: 10px;
    }
    
 `

const OrgCard = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 25%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #1e1e1e;
    border-radius: 10px;
    min-height: 280px;
    animation: ${fade_in} 0.2s ease-in-out;
    > * {
        margin: 10px;
        animation: ${fade_in} 1s ease-in-out;
    }

`


export default function ContestInterface() {
    console.log('re rendering interface')
    const { ens, contest_hash } = useParams();
    const info = useSelector(selectDashboardInfo)
    const { batchFetchDashboardData } = useCommon();

    useEffect(() => {
        batchFetchDashboardData(ens, info);
    }, [info])



    return (
        <>
            <BackButton customWidth={'70%'} link={'/' + ens + '/creator_contests'} text={"contest home"} />
            <ContestInterfaceWrap>
                <InterfaceTopSplit>
                    <RenderOrgCard info={info} />
                    <PromptDisplay />
                </InterfaceTopSplit>
                <ContestInfo />
                <RenderCheckpoint />
                <SubmissionDisplay />
            </ContestInterfaceWrap>
        </>
    )
}



function RenderOrgCard({ info }) {

    if (!info) {
        return (
            <OrgCard >
                <p>loading</p>
            </OrgCard>
        )
    }

    return (
        <OrgCard>
            <LazyLoadImage style={{ maxWidth: '12em', margin: '0 auto', borderRadius: '100px' }} src={`/${info.logo}`} effect="blur" />
            <Contest_h2_alt>{info.name}</Contest_h2_alt>
            <a href={'//' + info.website} target="_blank">{info.website}</a>
        </OrgCard>
    )
}

function RenderCheckpoint() {
    const progress_ratio = useSelector(selectProgressRatio)
    const durations = useSelector(selectDurations)

    return (
        <CheckpointWrap>
            <CheckpointTop>
                <ContestDurationCheckpointBar percent={progress_ratio} />
            </CheckpointTop>
            <CheckpointBottom>
                {durations.map((duration, index) => {
                    return (
                        <CheckpointBottomTag key={index} status={duration}>{duration}</CheckpointBottomTag>
                    )
                })}
            </CheckpointBottom>
        </CheckpointWrap>
    )
}
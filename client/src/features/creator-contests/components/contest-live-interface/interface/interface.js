import React, { useState, useEffect, useRef, Suspense } from 'react'
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ContestInfo from "../contest_info/contest-info";
import useContestState from "../../../../hooks/useContestState";
import PromptDisplay from '../prompts/prompt-display';
import SubmissionBuilder from '../submissions/submission-builder'
//import SubmissionDisplay from '../submissions/test-submission-display';
import { useDispatch, useSelector } from "react-redux";
import { ContestDurationCheckpointBar, ContestSubmissionCheckpointFallback } from "../../../../checkpoint-bar/checkpoint-bar";
import { selectProgressRatio, selectDurations } from './contest-interface-reducer';
import { OrgImg, ContestDetails, DetailRow, CheckpointWrap, CheckpointTop, CheckpointBottomTag, CheckpointBottom, label_status } from '../contest_info/contest-info-style';
import { selectDashboardInfo } from "../../../../dashboard/dashboard-info-reducer";
import { selectLogoCache } from "../../../../org-cards/org-cards-reducer";
import useCommon from "../../../../hooks/useCommon";
import { Contest_h2_alt } from '../../common/common_styles';
import BackButton from '../../../../back-button/back-button';
import * as WebWorker from '../../../../../app/worker-client.js'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { selectContestState } from "../interface/contest-interface-reducer";
import { Placeholder } from '../../common/common_components';
import DisplayWinners from '../winners/contest-winners';

const SubmissionDisplay = React.lazy(() => import('../submissions/test-submission-display'))

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
    align-items: center;
    flex: 1 0 25%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #1e1e1e;
    border-radius: 10px;
    > * {
        margin: 10px;
    }

`


export default function ContestInterface({ contest_settings, prompt_data }) {
    const { ens, contest_hash } = useParams();
    const [isSubmissionBuilder, setIsSubmissionBuilder] = useState(false);
    const [createSubmissionIndex, setCreateSubmissionIndex] = useState(-1);
    const info = useSelector(selectDashboardInfo)
    const { batchFetchDashboardData } = useCommon();
    const builderScroll = useRef(null);
    const contest_state = useSelector(selectContestState)


    useEffect(() => {
        batchFetchDashboardData(ens, info);
    }, [info])




    useEffect(() => {
        if (isSubmissionBuilder) {
            builderScroll.current.scrollIntoView({ behavior: 'smooth' });
        }

    }, [isSubmissionBuilder])


    return (
        <>
            <BackButton customWidth={'70%'} link={'/' + ens + '/creator_contests'} text={"contest home"} />
            <ContestInterfaceWrap>
                <InterfaceTopSplit>
                    {info && <RenderOrgCard info={info} />}
                    <PromptDisplay contest_settings={contest_settings} prompt_data={prompt_data} setIsSubmissionBuilder={setIsSubmissionBuilder} createSubmissionIndex={createSubmissionIndex} setCreateSubmissionIndex={setCreateSubmissionIndex} />
                </InterfaceTopSplit>
                {contest_settings && <ContestInfo contest_settings={contest_settings} />}
                <RenderCheckpoint />
                <DisplayWinners contest_state={contest_state} />
                <Suspense fallback={<Placeholder />}>
                    <SubmissionDisplay contest_state={contest_state} />
                </Suspense>
            </ContestInterfaceWrap>
        </>
    )
}



function RenderOrgCard({ info }) {



    return (
        <OrgCard>
            <LazyLoadImage style={{ maxWidth: '12em', margin: '0 auto', borderRadius: '100px' }} src={`/${info.logo}`} effect="blur" />
            <Contest_h2_alt>{info.name}</Contest_h2_alt>
            <a href={'//' + info.website} target="_blank">{info.website}</a>
        </OrgCard>
    )
}

function RenderCheckpoint() {
    const barProgress = useSelector(selectProgressRatio);
    const durations = useSelector(selectDurations);

    return (
        <CheckpointWrap>
            <CheckpointTop>
                <ContestDurationCheckpointBar percent={barProgress} />
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
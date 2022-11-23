import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import BackButton from '../../../../back-button/back-button';
import { ContestDurationCheckpointBar } from "../../../../checkpoint-bar/checkpoint-bar";
import { selectDashboardInfo } from "../../../../dashboard/dashboard-info-reducer";
import useCommon from "../../../../hooks/useCommon";
import { Contest_h2_alt } from '../../common/common_styles';
import ContestStateInfo from '../contest-state-info/state-info-display';
import ContestInfo from "../contest_info/contest-info";
import { CheckpointBottom, CheckpointBottomTag, CheckpointTop, CheckpointWrap } from '../contest_info/contest-info-style';
import PromptDisplay from '../prompts/prompt-display';
import SubmissionDisplay from '../submissions/submission-display/submission-display';
import { selectDurations, selectProgressRatio } from './contest-interface-reducer';

const ContestInterfaceWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 90vw;
    margin: 0 auto;
    padding-bottom: 100px;

`
const InterfaceTopSplit = styled.div`
    display: flex;
    flex-direction: row;
    //justify-content: center;
    //margin: -10px;
    flex-wrap: wrap;
    margin-bottom: 10px;
    //background-color: orange;
    @media screen and (max-width: 800px){
        flex-direction: column;
    }
 `

export const WebLink = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 7px;
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    color: #4d4d4d;
    &:hover{
        color: #cccccc;
        background-color: #1e1e1e;
    }
`

const InterfaceTopLeft = styled.div`
    display: flex;
    flex: 0 0 55%;
    flex-direction: column;
    //background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    > * {
       margin-bottom: 20px;
    }
`

const InterfaceTopRight = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0 0 40%;
    margin-left: auto;
    > * {
        margin: 5px;
    }
    @media screen and (max-width: 800px){
        align-items: flex-start;
        flex-direction: row;
        width: 100%;
        margin: 0;
    }

    @media screen and (max-width: 600px){
        align-items: flex-start;
        flex-direction: column;
        width: 100%;
        margin: 0;
    }
`


const OrgCard = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    //width: 90vw;
    background-color: #262626;
    //width: fit-content;
    border-radius: 10px;
    padding: 5px 10px;
    min-height: 6em;
    > * {
        margin: 10px;
    }

`

export default function ContestInterface() {
    const { ens, contest_hash } = useParams();
    const info = useSelector(selectDashboardInfo)
    const { batchFetchDashboardData } = useCommon();

    useEffect(() => {
        batchFetchDashboardData(ens, info);
    }, [info])



    return (
        <>
            <BackButton customWidth={'90%'} link={'/' + ens + '/creator_contests'} text={"contest home"} />
            <ContestInterfaceWrap>
                <InterfaceTopSplit>
                    <InterfaceTopLeft>
                        <RenderOrgCard info={info} />
                        <PromptDisplay />
                        <RenderCheckpoint />
                    </InterfaceTopLeft>
                    <InterfaceTopRight>
                        <ContestInfo />
                        <ContestStateInfo />
                    </InterfaceTopRight>
                </InterfaceTopSplit>
                <SubmissionDisplay />
            </ContestInterfaceWrap>
        </>
    )
}



function RenderOrgCard({ info }) {

    if (!info) {
        return (
            <OrgCard >
            </OrgCard>
        )
    }

    return (
        <OrgCard>
            <LazyLoadImage style={{ maxWidth: '5em', margin: '0 auto', borderRadius: '100px' }} src={`/${info.logo}`} effect="blur" />
            <Contest_h2_alt>{info.name}</Contest_h2_alt>
            <WebLink onClick={() => window.open(`//${info.website}`, '_blank')}><FontAwesomeIcon icon={faGlobe} /></WebLink>
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
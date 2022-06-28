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
import CheckpointBar from "../../../checkpoint-bar/checkpoint-bar";
import { Countdown } from "../common/common_components";


const ContestInterfaceWrap = styled.div`
    width: 70vw;
    margin: 0 auto;
    background-color: #22272e;
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
`

const CheckpointWrap = styled.div`
    margin: 0 auto;
    width: 80%;
    color: #d3d3d3;
    margin-bottom: 1em;
`

const CheckpointBottom = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 85%;
    color: #d3d3d3;
    margin: 0 auto;
`

const label_status_colors = [
    { text: 'rgb(138, 128, 234)', background: 'rgba(138, 128, 234, 0.3)' },
    { text: 'rgb(211, 151, 39)', background: 'rgba(211, 151, 39, 0.3)' },
    { text: 'rgb(0, 163, 104)', background: 'rgba(0, 163, 104, 0.3)' }

]

export default function ContestInterface({ }) {
    const [barProgress, setBarProgress] = useState(0);

    const { ens } = useParams();
    const [isInfoLoaded, setIsInfoLoaded] = useState(false)
    const dispatch = useDispatch();

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



    let end_date = moment.utc(contest_data.date_times.end_date).local().format('ddd. M/D hh:mm A').toString()

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
                            <Label color={label_status_colors[1]}>accepting submissions</Label>
                        </DetailRow>
                    </ContestDetails>
                </HeadingSection1>
            </InterfaceHeading>
            <CheckpointWrap>
                <CheckpointBar percent={barProgress} />
            </CheckpointWrap>
            <CheckpointBottom>
                <Countdown
                setBarProgress={setBarProgress}
                time_0={contest_data.date_times.start_date} 
                time_1={contest_data.date_times.voting_begin} 
                time_2={contest_data.date_times.end_date} 
                interval={1000} />
            </CheckpointBottom>
            <div><h4>more</h4></div>
        </ContestInterfaceWrap>
    )
}


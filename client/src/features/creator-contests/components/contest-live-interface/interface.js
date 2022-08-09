import React, { useContext, useEffect, useState } from 'react'
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ContestInfo from "./interface/contest_info/contest-info";
import useContestState from "../../../hooks/useContestState";
import { selectProgressRatio, selectContestState, selectDurations } from './contest-interface-reducer';
import { useSelector } from 'react-redux';


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



export default function ContestInterface({ contest_settings }) {
    const { ens } = useParams();
    const [isSubmissionBuilder, setIsSubmissionBuilder] = useState(false);

    const stateManager = useContestState(
        contest_settings.date_times.start_date,
        contest_settings.date_times.voting_begin,
        contest_settings.date_times.end_date
    );

    console.log('re render parent')


    return (
        <ContestInterfaceWrap>
            
            {contest_settings && <ContestInfo contest_settings={contest_settings}/>}
            {/*<PromptDisplay setIsSubmissionBuilder={setIsSubmissionBuilder} />*/}
            {/*{isSubmissionBuilder && <SubmissionBuilder setIsSubmissionBuilder={setIsSubmissionBuilder} />}*/}
            {/*<SubmissionDisplay />*/}
        </ContestInterfaceWrap>
    )
}



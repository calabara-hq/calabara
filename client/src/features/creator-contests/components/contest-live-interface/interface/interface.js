import React, { useState } from 'react'
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ContestInfo from "../contest_info/contest-info";
import useContestState from "../../../../hooks/useContestState";


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
            
            {contest_settings && <ContestInfo contest_settings={contest_settings}/>}
            {/*<PromptDisplay setIsSubmissionBuilder={setIsSubmissionBuilder} />*/}
            {/*{isSubmissionBuilder && <SubmissionBuilder setIsSubmissionBuilder={setIsSubmissionBuilder} />}*/}
            {/*<SubmissionDisplay />*/}
        </ContestInterfaceWrap>
    )
}



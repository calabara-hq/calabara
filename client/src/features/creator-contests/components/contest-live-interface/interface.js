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
import { Label, labelColorOptions } from "../common/common_styles";
import { ContestDurationCheckpointBar } from "../../../checkpoint-bar/checkpoint-bar";
import useContestTimekeeper from "../../../hooks/useContestTimekeeper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import SubmissionBuilder from "./interface/submissions/submission-builder-2";
import SubmissionDisplay from "./interface/submissions/test-submission-display";
import SubmissionModal from "./interface/submissions/edit-submission-modal";
import PromptDisplay from "./interface/prompts/prompt-display";
import axios from 'axios';
import ContestInfo from "./interface/contest_info/contest-info";

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



export default function ContestInterface({ }) {
    const [isSubmissionBuilder, setIsSubmissionBuilder] = useState(false);
    const [contest_settings, setContestSettings] = useState(null);
    const { ens } = useParams();


    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_contest/${ens}`);
            setContestSettings(res.data)
            console.log('fetching data')

        })();
    }, [])


    return (
        <ContestInterfaceWrap>
            {contest_settings && <ContestInfo contest_settings={contest_settings} />}
            <PromptDisplay setIsSubmissionBuilder={setIsSubmissionBuilder} />
            {isSubmissionBuilder && <SubmissionBuilder setIsSubmissionBuilder={setIsSubmissionBuilder} />}
            <SubmissionDisplay />
        </ContestInterfaceWrap>
    )
}


import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDashboardInfo } from "../../../../dashboard/dashboard-info-reducer";
import { selectLogoCache } from "../../../../org-cards/org-cards-reducer";
import useCommon from "../../../../hooks/useCommon";
import { useParams } from "react-router-dom";
import * as WebWorker from '../../../../../app/worker-client.js'
import moment from "moment";
import { Label, labelColorOptions } from "../../common/common_styles";
import { ContestDurationCheckpointBar } from "../../../../checkpoint-bar/checkpoint-bar";
import useContestTimekeeper from "../../../../hooks/useContestTimekeeper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { InterfaceHeading, HeadingSection1, OrgImg, ContestDetails, DetailRow, CheckpointWrap, CheckpointBottomTag, CheckpointBottom, label_status } from './contest-info-style'
import { selectProgressRatio, selectContestState, selectDurations } from "../interface/contest-interface-reducer";

export default function ContestInfo({ contest_settings }) {
    const { ens } = useParams();
    const [isInfoLoaded, setIsInfoLoaded] = useState(false);
    const dispatch = useDispatch();

    const contest_state = useSelector(selectContestState);
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


        Object.values(contest_settings.submitter_rewards).map((reward) => {
            if (reward['erc20']) erc20_sum += reward['erc20']
            if (reward['erc721']) erc721_sum += reward['erc721']
            if (reward['eth']) eth_sum += reward['eth']
        })

        // TURTLES. Not working now because voter / submitter are not similar format
        Object.values(contest_settings.voter_rewards).map((reward) => {
            if (reward['erc20']) erc20_sum += reward['erc20']
            if (reward['erc721']) erc721_sum += reward['erc721']
            if (reward['eth']) eth_sum += reward['eth']
        })

        return [
            { sum: erc20_sum, symbol: contest_settings.reward_options['erc20'] },
            { sum: 3, symbol: 'NOUN' },//contest_settings.reward_options['erc721'] },
            { sum: eth_sum, symbol: 'ETH' },
        ]
    }

    let end_date = moment.utc(contest_settings.date_times.end_date).local().format('ddd. M/D hh:mm A').toString()
    let rewards_sum = calculateRewardsSum();
    return (
        <>
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
                            {contest_state !== null && <Label color={label_status[contest_state]}>{label_status[contest_state].status}</Label>}
                        </DetailRow>
                        {rewards_sum.map((reward, index) => {
                            if (reward.sum > 0) return (
                                <DetailRow key={index}>
                                    {index === 0 ? <p>Rewards:</p> : <b></b>}
                                    <p>{reward.sum} {reward.symbol}</p>
                                </DetailRow>
                            )
                        })}
                        <DetailRow>
                            <p>Voter Rewards:</p>
                            <FontAwesomeIcon style={{ fontSize: '1.5em', color: Object.keys(contest_settings.voter_rewards).length > 0 ? '#00a368' : 'red' }} icon={Object.keys(contest_settings.voter_rewards).length > 0 ? faCheckCircle : faTimesCircle} />
                        </DetailRow>
                    </ContestDetails>
                </HeadingSection1>
            </InterfaceHeading>
            <RenderCheckpoint />
        </>
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
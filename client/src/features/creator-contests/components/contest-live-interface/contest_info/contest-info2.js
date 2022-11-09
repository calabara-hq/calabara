import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as WebWorker from '../../../../../app/worker-client.js'
import moment from "moment";
import { Label, labelColorOptions, fade_in, Contest_h4 } from "../../common/common_styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { InterfaceHeading, ContestDetails, DetailRow, DetailRowHover, CheckpointWrap, CheckpointBottomTag, CheckpointBottom, label_status, DetailBox, DetailItem, ContestDetailWrapper } from './contest-info-style'
import { selectContestSettings, selectContestState } from "../interface/contest-interface-reducer";

import DrawerComponent from "../../../../drawer/drawer.js";
import { SummaryWrap } from "../../contest-details/detail-style.js";
import ContestSummaryComponent from "../../contest-details/detail-components.js";
import styled from 'styled-components'


const processSubmitterRewards = (contest_settings) => {
    let compact_formatter = Intl.NumberFormat('en', { notation: 'compact' })

    let [erc20_sum, erc721_sum, eth_sum] = [0, 0, 0];
    let agg_rewards = []

    Object.values(contest_settings.submitter_rewards).map((reward) => {
        if (reward['erc20']) erc20_sum += reward['erc20'].amount
        if (reward['erc721']) erc721_sum += 1
        if (reward['eth']) eth_sum += reward['eth'].amount
    })

    if (erc20_sum > 0) agg_rewards.push({ sum: compact_formatter.format(erc20_sum), symbol: contest_settings.reward_options['erc20'].symbol })
    if (erc721_sum > 0) agg_rewards.push({ sum: compact_formatter.format(erc721_sum), symbol: contest_settings.reward_options['erc721'].symbol })
    if (eth_sum > 0) agg_rewards.push({ sum: compact_formatter.format(eth_sum), symbol: 'ETH' })


    return agg_rewards


}


const DetailElement = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    //height: 290px;
    @media screen and (max-width: 800px){
        width: 50%;
    }
    @media screen and (max-width: 600px){
        width: 100%;
    }

`
const DetailGrid = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    gap: 15px;
    > * p {
        margin: 0;
    }
`

const GridElement = styled.div`
    display: flex;
    > div:first-child{
        width: 50%;
        display: flex;
        align-items: center;
        font-weight: 500;
        color: #a3a3a3;
    }
    > div:nth-child(2){
        width: 50%;
        display: flex;
        color: #c3c3c3;
        font-weight: 550;

        > * {
            margin-left: auto;
        }

    }
`

export default function ContestInfo() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { ens } = useParams();
    const contest_settings = useSelector(selectContestSettings)
    const contest_state = useSelector(selectContestState)

    let start_date = moment.utc(contest_settings.date_times.start_date).local().format('M/D hh:mm A').toString()
    let end_date = moment.utc(contest_settings.date_times.end_date).local().format('M/D hh:mm A').toString()
    let processed_rewards = processSubmitterRewards(contest_settings);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        document.body.style.overflow = 'unset';

    }


    return (
        <>
            <DetailElement>
                <DetailGrid>
                    <Contest_h4>Details</Contest_h4>
                    <GridElement>
                        <div>
                            <p>Status</p>
                        </div>
                        <div>
                            <Label color={label_status[contest_state]}>{label_status[contest_state].status}</Label>
                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p>Starts</p>
                        </div>
                        <div>
                            <p>{start_date}</p>
                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p>Ends</p>
                        </div>
                        <div>
                            <p>{end_date}</p>
                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p>Submitter Rewards</p>
                        </div>
                        <div>
                            {processed_rewards.length === 0 && <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'rgba(178,31,71)', fontSize: '1.5em' }} />}
                            {processed_rewards.length === 1 && <p>{processed_rewards[0].sum} {processed_rewards[0].symbol}</p>}
                            {processed_rewards.length > 1 && <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'rgb(6, 214, 160)', fontSize: '1.5em' }} />}
                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p>Voter Rewards</p>
                        </div>
                        <div>
                            {Object.values(contest_settings.voter_rewards).length === 0 && <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'rgba(178,31,71)', fontSize: '1.5em' }} />}
                            {Object.values(contest_settings.voter_rewards).length > 0 && <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'rgb(6, 214, 160)', fontSize: '1.5em' }} />}
                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p></p>
                        </div>
                        <div style={{cursor: 'pointer'}} onClick={handleDrawerOpen}>
                            <p>more details</p>
                        </div>
                    </GridElement>
                </DetailGrid>
            </DetailElement>
            <DrawerComponent drawerOpen={drawerOpen} handleClose={handleDrawerClose} showExit={true}>
                <SummaryWrap>
                    <ContestSummaryComponent contest_settings={contest_settings} />
                </SummaryWrap>
            </DrawerComponent>
        </>
    )
}

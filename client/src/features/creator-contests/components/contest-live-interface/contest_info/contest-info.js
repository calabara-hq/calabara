import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as WebWorker from '../../../../../app/worker-client.js'
import moment from "moment";
import { Label, labelColorOptions, fade_in } from "../../common/common_styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { InterfaceHeading, ContestDetails, DetailRow, DetailRowHover, CheckpointWrap, CheckpointBottomTag, CheckpointBottom, label_status, DetailBox, DetailItem, ContestDetailWrapper } from './contest-info-style'
import { selectContestSettings, selectContestState } from "../interface/contest-interface-reducer";

import DrawerComponent from "../../../../drawer/drawer.js";
import styled from 'styled-components';
import { Placeholder } from '../../common/common_components';
import { SummaryWrap } from "../../contest-details/detail-style.js";
import ContestSummaryComponent from "../../contest-details/detail-components.js";



const processSubmitterRewards = (contest_settings) => {
    let compact_formatter = Intl.NumberFormat('en', { notation: 'compact' })

    let [erc20_sum, erc721_sum, eth_sum] = [0, 0, 0];
    let agg_rewards = []


    Object.values(contest_settings.submitter_rewards).map((reward) => {
        if (reward['erc20']) erc20_sum += reward['erc20'].amount
        if (reward['erc721']) erc721_sum += reward['erc721'].amount
        if (reward['eth']) eth_sum += reward['eth'].amount
    })

    if (erc20_sum > 0) agg_rewards.push({ sum: compact_formatter.format(erc20_sum), symbol: contest_settings.reward_options['erc20'].symbol })
    if (erc721_sum > 0) agg_rewards.push({ sum: compact_formatter.format(erc721_sum), symbol: contest_settings.reward_options['erc721'].symbol })
    if (eth_sum > 0) agg_rewards.push({ sum: compact_formatter.format(eth_sum), symbol: 'ETH' })


    return agg_rewards


}


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
            <ContestDetailWrapper>
                <ContestDetails>
                    <DetailBox>
                        <DetailRow>
                            <DetailItem>
                                <p>Starts:</p>
                            </DetailItem>
                            <DetailItem>
                                <p>{start_date}</p>
                            </DetailItem>
                        </DetailRow>
                        <DetailRow>
                            <DetailItem>
                                <p>Ends:</p>
                            </DetailItem>
                            <DetailItem>
                                <p>{end_date}</p>
                            </DetailItem>
                        </DetailRow>
                    </DetailBox>
                    <DetailBox onClick={handleDrawerOpen}>
                        <DetailRow>
                            <DetailItem> <p>Submitter Rewards:</p></DetailItem>
                            <DetailItem>
                                {processed_rewards.length === 0 && <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'rgba(178,31,71)', fontSize: '1.5em' }} />}
                                {processed_rewards.length === 1 && <p>{processed_rewards[0].sum} {processed_rewards[0].symbol}</p>}
                                {processed_rewards.length > 1 && <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'rgb(6, 214, 160)', fontSize: '1.5em' }} />}
                            </DetailItem>
                        </DetailRow>
                        <DetailRow>
                            <DetailItem><p>Voter Rewards:</p></DetailItem>
                            <DetailItem>
                                {Object.values(contest_settings.voter_rewards).length === 0 && <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'rgba(178,31,71)', fontSize: '1.5em' }} />}
                                {Object.values(contest_settings.voter_rewards).length > 0 && <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'rgb(6, 214, 160)', fontSize: '1.5em' }} />}
                            </DetailItem>
                        </DetailRow>
                    </DetailBox>
                    <DetailBox >
                        <DetailRow>
                            <DetailItem>
                                <p>Contest Details:</p>
                            </DetailItem>
                            <DetailItem shouldHover={true}>
                                <button onClick={handleDrawerOpen}><FontAwesomeIcon icon={faQuestionCircle} /></button>
                            </DetailItem>
                        </DetailRow>
                        <DetailRow>
                            <DetailItem>
                                <p>Status:</p>
                            </DetailItem>
                            <DetailItem>
                                <Label color={label_status[contest_state]}>{label_status[contest_state].status}</Label>
                            </DetailItem>
                        </DetailRow>
                    </DetailBox>
                </ContestDetails>
            </ContestDetailWrapper>
            {/*<ContestInfoDrawer contest_settings={contest_settings} handleClose={handleDrawerClose} drawerOpen={drawerOpen} />*/}
            <DrawerComponent drawerOpen={drawerOpen} handleClose={handleDrawerClose} showExit={true}>
                <SummaryWrap>
                    <ContestSummaryComponent contest_settings={contest_settings}/>
                </SummaryWrap>
            </DrawerComponent>
        </>
    )
}

/*
const DrawerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 95%;
    margin: 0 auto;
    margin-left: 20px;
    margin-top: 20px;
    height: 100%;
    color: #d3d3d3;
    animation: ${fade_in} 0.5s ease-in-out;

    > * {
        margin-bottom: 30px;
    }
`


const DrawerStyle = styled.div`
    background-color: #1e1e1e;
    overflow-y: scroll;
    width: 50vw;
`



function ContestInfoDrawer({ contest_settings, drawerOpen, handleClose }) {

    return (
        <Drawer
            open={drawerOpen}
            onClose={handleClose}
            direction='right'
            className='prompt-expand'
        >
            {drawerOpen &&
                <DrawerWrapper>
                    <ContestMoreDetails contest_settings={contest_settings} mode={0} />
                </DrawerWrapper>
            }
        </Drawer>
    )
}
*/
import { faCheckCircle, faQuestionCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Contest_h4, Label } from "../../common/common_styles";
import { selectContestSettings, selectContestState } from "../interface/contest-interface-reducer";
import { DetailElement, DetailGrid, GridElement, label_status, RestrictionStatus } from './contest-info-style';

import DrawerComponent from "../../../../drawer/drawer.js";
import ContestSummaryComponent from "../../contest-details/detail-components.js";
import { SummaryWrap } from "../../contest-details/detail-style.js";


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




export default function ContestInfo() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { ens } = useParams();
    const contest_settings = useSelector(selectContestSettings)
    const contest_state = useSelector(selectContestState)

    let vote_date = moment(contest_settings.date_times.voting_begin).local().format('M/D hh:mm A').toString()
    let end_date = moment(contest_settings.date_times.end_date).local().format('M/D hh:mm A').toString()
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
                <span onClick={handleDrawerOpen}><FontAwesomeIcon icon={faQuestionCircle} /></span>
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
                            <p>Voting Begins</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '15px', color: '#a3a3a3' }}>{vote_date}</p>
                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p>Ends</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '15px', color: '#a3a3a3' }}>{end_date}</p>
                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p>Submitter Rewards</p>
                        </div>
                        <div>

                            {processed_rewards.length === 0 && <p><RestrictionStatus status={false} /></p>}
                            {processed_rewards.length === 1 && <p>{processed_rewards[0].sum} {processed_rewards[0].symbol}</p>}
                            {processed_rewards.length > 1 && <p><RestrictionStatus status={true} /></p>}

                        </div>
                    </GridElement>
                    <GridElement>
                        <div>
                            <p>Voter Rewards</p>
                        </div>
                        <div>
                            <p>
                                {Object.values(contest_settings.voter_rewards).length === 0 && <RestrictionStatus status={false} />}
                                {Object.values(contest_settings.voter_rewards).length > 0 && <RestrictionStatus status={true} />}
                            </p>
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

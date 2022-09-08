import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { fade_in, Label, TagType } from '../../common/common_styles'
import { selectContestSettings } from '../interface/contest-interface-reducer'


const DetailWrap = styled.div`
    display: flex;
    flex-direction: column;
    > * {
        background-color: #262626;
        border-radius: 10px;
        animation: ${fade_in} 0.4s ease-in-out;
        margin-bottom: 20px;
    }
`

const RewardContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
`

const RewardRow = styled.div`
    display: flex;
    border: 1px dotted grey;
    border-radius: 4px;

    > * {
        margin: 10px;
    }
    > p {
        //text-align: left;
    }

`

const VoterRow = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px dotted grey;
    border-radius: 4px;

    > * {
        margin: 10px;
    }
    > p {
        //text-align: left;
    }
    > li {
        & span{
        margin-left: 10px;
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
        }
    }

`

const RewardDetailWrap = styled.div`


    > * {
        margin: 10px;
    }

    > * {
        margin-bottom: 30px;
    }

`

const VotingDetailWrap = styled.div`

    > * {
        margin: 10px;
    }

    > * {
        margin-bottom: 20px;
    }   

    > h3 {
        margin-top: 20px;
    margin-bottom: 10px;
    }

`
const OptionType = styled.p`
    color: lightgrey;
    margin: 10px 0;

    & > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`



// show details about rewards and some other things
// mode determines the order that we show items
// if mode = 0, order the rewards first
// else, order x first

export default function ContestMoreDetails() {
    const contest_settings = useSelector(selectContestSettings)

    return (
        <>
            <h2>Contest Details</h2>
            <DetailWrap>
                <ContestRewardDetails contest_settings={contest_settings} />
                <VotingPowerDetails contest_settings={contest_settings} />
            </DetailWrap>
        </>
    )

}

const nth = {
    1: '1st',
    2: '2nd',
    3: '3rd',
    4: '4th',
    5: '5th',
    6: '6th',
    7: '7th',
    8: '8th',
    9: '9th'
}



function ContestRewardDetails({ contest_settings }) {

    return (
        <RewardDetailWrap>
            <div>
                <h3>Rewards</h3>
                <p>Contests can be configured to reward participants with ETH, ERC-20, and ERC-721 rewards. Rewards are split into 2 categories: Submitter rewards and voter rewards.</p>
            </div>
            <div>
                <h4>Submitter Rewards</h4>
                <p>Submitter rewards define the amount of a particular token awarded to the winning submissions of a contest.</p>
                {Object.values(contest_settings.submitter_rewards).length === 0 && <p><b>There are no submitter rewards defined for this contest.</b></p>}
                {Object.values(contest_settings.submitter_rewards).length > 0 &&
                    <RewardContainer>
                        <p><b>Here's the breakdown for this contest:</b></p>
                        {Object.values(contest_settings.submitter_rewards).map((reward, idx) => {
                            return (
                                <RewardRow key={idx}>
                                    <p><b>{nth[reward.rank]} place:</b></p>
                                    {reward.eth ? <p>{reward.eth.amount} ETH</p> : null}
                                    {reward.erc20 ? <p style={{ marginLeft: '30px' }}>{reward.erc20.amount} {reward.erc20.symbol}</p> : null}
                                    {reward.erc721 ? <p style={{ marginLeft: '30px' }}>{reward.erc721.amount} {reward.erc721.symbol}</p> : null}

                                </RewardRow>
                            )
                        })}
                    </RewardContainer>
                }
            </div>
            <div>
                <h4>Voter Rewards</h4>
                <p>Voter rewards define the amount of a particular token <b>split</b> amongst the voters that correctly choose the winning submissions.</p>
                {Object.values(contest_settings.voter_rewards).length === 0 && <p><b>There are no voter rewards defined for this contest.</b></p>}
                {Object.values(contest_settings.voter_rewards).length > 0 &&
                    <RewardContainer>
                        <p><b>Here's the breakdown for this contest:</b></p>
                        {Object.values(contest_settings.voter_rewards).map((reward, idx) => {
                            return (
                                <RewardRow key={idx}>
                                    {reward.eth ? <p>Voters that accurately choose the {nth[reward.rank]} place submission will <b>split </b>{reward.eth.amount} ETH</p> : null}
                                    {reward.erc20 ? <p>Voters that accurately choose the {nth[reward.rank]} place submission will <b>split </b>{reward.erc20.amount} {reward.erc20.symbol}</p> : null}
                                </RewardRow>
                            )
                        })}
                    </RewardContainer>
                }

            </div>

        </RewardDetailWrap>
    )
}

function VotingPowerDetails({ contest_settings }) {
    //console.log(contest_settings)
    return (
        <VotingDetailWrap>
            <h3>Voting Power Calulation</h3>
            <p>Voter Power is configured in two categories:</p>
            <li><b>Token:</b> Voting credits are based on ERC-20 or ERC-721 holdings.</li>
            <li><b>Arcade:</b> A uniform number of credits alloted to each voter.</li>
            {contest_settings.voting_strategy.strategy_type == 'token' ?
                <TokenComponent voting_strategy={contest_settings.voting_strategy} />
                :
                <ArcadeComponent voting_strategy={contest_settings.voting_strategy} />
            }
        </VotingDetailWrap>
    )



}

function TokenComponent({ voting_strategy }) {


    return (
        <VoterRow>
            <p>This contest uses a <b>{voting_strategy.strategy_type}</b> strategy:</p>
            <li>Type: <b>{voting_strategy.symbol}</b> <TagType type={voting_strategy.type}>{voting_strategy.type}</TagType></li>
            <li>1 <b>{voting_strategy.symbol}</b> equals 1 <b>voting credit</b></li>
            {voting_strategy.hard_cap > 0 &&
                <li>Contest hard cap: <b>{voting_strategy.hard_cap}</b></li>
            }
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }

        </VoterRow>

    )



}

function ArcadeComponent({ voting_strategy }) {


    return (
        <VoterRow>
            <p>This contest uses an <b>{voting_strategy.strategy_type} strategy:</b></p>
            <li>Total Votes: <b>{voting_strategy.hard_cap}</b></li>
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }
        </VoterRow>


    )


}

/*                {contest_settings.voting_strategy.strategy_type == 'token' ? 
                <p>This contest uses <b>{contest_settings.voting_strategy.symbol}</b> <b>{contest_settings.voting_strategy.strategy_type}</b></p>
                : 
                <p>This contest uses <b>{contest_settings.voting_strategy.strategy_type} strategy</b></p>
}
*/

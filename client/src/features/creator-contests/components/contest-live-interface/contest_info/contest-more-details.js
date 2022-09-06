import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { fade_in } from '../../common/common_styles'


const DetailWrap = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #262626;
    border-radius: 10px;
    animation: ${fade_in} 0.4s ease-in-out;
    > * {
        margin: 10px;
    }
`

const RewardContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
`

const RewardRow = styled.div`
    display: flex;
    border: 1px dotted grey;

    > * {
        margin: 10px;
    }
    > p {
        //text-align: left;
    }

`

const RewardDetailWrap = styled.div`
    > * {
        margin-bottom: 30px;
    }

`


// show details about rewards and some other things
// mode determines the order that we show items
// if mode = 0, order the rewards first
// else, order x first

export default function ContestMoreDetails({ mode, contest_settings }) {



    return (
        <DetailWrap>
            <h2>Contest Details</h2>
            <ContestRewardDetails contest_settings={contest_settings} />
        </DetailWrap>
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
    Object.values(contest_settings.voter_rewards).map(reward => {
        
    })

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
                        {Object.values(contest_settings.submitter_rewards).map(reward => {
                            return (
                                <RewardRow>
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
                        {Object.values(contest_settings.voter_rewards).map(reward => {
                            return (
                                <RewardRow>
                                    {reward.eth ? <p>Voters that accurately choose the {nth[reward.rank]} place submission will <b>split </b>{reward.eth.amount} ETH</p> : null}
                                    {reward.erc20 ? <p>Voters that accurately choose the {nth[reward.rank]} place submission will <b>split </b>{reward.erc20.amount} {reward.erc20.amount}</p> : null}
                                </RewardRow>
                            )
                        })}
                    </RewardContainer>
                }

            </div>
        </RewardDetailWrap>
    )
}
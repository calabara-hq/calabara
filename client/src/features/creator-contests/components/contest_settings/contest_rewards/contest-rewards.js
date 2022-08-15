import React, { useState, useEffect, useReducer } from "react";
import styled, { keyframes } from 'styled-components'
import RewardSelector from "./choose-rewards";
import { Contest_h2, Contest_h2_alt, Contest_h3, fade_in } from '../../common/common_styles'
import SubmitterRewardsBlock from "./submitter-rewards/submitter-rewards";
import VoterRewardsBlock from "./voter-rewards/voter-rewards";

const Rewards = styled.div`
    display: flex;
    flex-direction: column;
    &::before{
        content: '${props => props.title}';
        position: absolute;
        transform: translate(0%, -150%);
        color: #f2f2f2;
        font-size: 30px;
    }

    > * {
        //margin: 10px 0;
        //margin-bottom: 30px;
    }

`

const RewardsMainHeading = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 33%);
    //grid-row-gap: 20px;    
    grid-template-areas: "heading . logo"
                         "rewards rewards rewards";


`


const ParticipantRewardsWrap = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 20px;
    }
`



export default function ContestRewardsBlock({ theme, rewardOptions, setRewardOptions, selectedRewards, setSelectedRewards, submitterRewards, setSubmitterRewards, voterRewards, setVoterRewards, errorMatrix, setErrorMatrix }) {

    const handleErrors = () => {
        let err_matrix_copy = JSON.parse(JSON.stringify(errorMatrix))
        let submitter_rewards_arr = Object.values(submitterRewards)
        let voter_rewards_arr = Object.entries(voterRewards)

        // check for non whole number nft allocations
        submitter_rewards_arr.map((row, index) => {
            if (row.erc721 % 1 > 0) {
                err_matrix_copy[index][3] = 'must be a whole number'
                setErrorMatrix(err_matrix_copy)
            }
        })

        voter_rewards_arr.map(([key, val], index) => {
            if (val.reward == 0) {
                voter_rewards_arr.splice(key, 1)
            }
        })
        setVoterRewards({ type: 'update_all', payload: Object.fromEntries(voter_rewards_arr) })
    }



    const isVoterBlockVisible = () => {
        if (selectedRewards['erc721'] && Object.keys(selectedRewards).length === 1) return false
        return true
    }

    return (
        <Rewards theme={theme} title='Contest Rewards'>

            <RewardsMainHeading>
                <RewardSelector rewardOptions={rewardOptions} setRewardOptions={setRewardOptions} selectedRewards={selectedRewards} setSelectedRewards={setSelectedRewards} />
            </RewardsMainHeading>


            {Object.keys(selectedRewards).length > 0 &&
                <ParticipantRewardsWrap>
                    <SubmitterRewardsBlock errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix} submitterRewards={submitterRewards} setSubmitterRewards={setSubmitterRewards} selectedRewards={selectedRewards} theme={theme} />
                    {isVoterBlockVisible() && <VoterRewardsBlock num_voting_rewards={Object.values(submitterRewards)} submitter_rewards={Object.values(submitterRewards)} selectedRewards={selectedRewards} voterRewards={voterRewards} setVoterRewards={setVoterRewards} />}
                </ParticipantRewardsWrap>
            }
            {/*<button onClick={handleErrors}>submit</button>*/}
        </Rewards>

    )
}

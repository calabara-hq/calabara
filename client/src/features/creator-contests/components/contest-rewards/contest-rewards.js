import React, { useState, useEffect, useReducer } from "react";
import styled, { keyframes } from 'styled-components'
import CounterButton from "../common/CounterButton";
import RewardSelector from "./choose-rewards";
import { Contest_h2, Contest_h3, fade_in } from '../common/common_styles'
import SubmitterRewards from "./submitter-rewards/submitter-rewards";
import SubmitterRewardsBlock from "./submitter-rewards/submitter-rewards";
import VoterRewardsBlock from "./voter-rewards/voter-rewards";

const Rewards = styled.div`
    display: flex;
    flex-direction: column;
    color: #d3d3d3;
    background-color: #22272e;
    border: 2px solid #444c56;
    border-radius: 4px;
    padding: 10px;
    width: 70%;
    margin: 0 auto;

    > * {
        margin-bottom: 50px;
    }

`

const RewardsMainHeading = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 33%);
    grid-row-gap: 30px;    
    grid-template-areas: "heading . logo"
                         "rewards rewards rewards";

`


const ParticipantRewardsWrap = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 50px;
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
        <Rewards theme={theme}>
            <RewardsMainHeading>
                <Contest_h2 grid_area={'heading'}>Contest Rewards</Contest_h2>
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

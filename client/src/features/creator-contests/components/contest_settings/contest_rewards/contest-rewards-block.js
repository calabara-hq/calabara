import React, { useState, useEffect, useReducer } from "react";
import styled, { keyframes } from 'styled-components'
import RewardSelector from "./choose-rewards";
import { Contest_h2, Contest_h2_alt, Contest_h3, fade_in } from '../../common/common_styles'
import SubmitterRewardsBlock from "./submitter-rewards/submitter-rewards";
import VoterRewardsBlock from "./voter-rewards/voter-rewards";
import { rewardOptionState } from "./reducers/rewards-reducer";
import { useSelector } from "react-redux";

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



export default function ContestRewardsBlock({ theme, voterRewards, setVoterRewards, SubmitterRewardsRef, VoterRewardsRef }) {
    const selectedRewards = useSelector(rewardOptionState.getSelectedRewards)


    const isVoterBlockVisible = () => {
        if (selectedRewards['erc721'] && Object.keys(selectedRewards).length === 1) return false
        return true
    }

    return (
        <Rewards theme={theme} title='Contest Rewards'>

            <RewardsMainHeading>
                <RewardSelector />
            </RewardsMainHeading>


            {Object.keys(selectedRewards).length > 0 &&
                <ParticipantRewardsWrap>
                    <SubmitterRewardsBlock theme={theme} SubmitterRewardsRef={SubmitterRewardsRef} />
                    {isVoterBlockVisible() && <VoterRewardsBlock theme={theme} VoterRewardsRef={VoterRewardsRef} />}
                </ParticipantRewardsWrap>
            }
            {/*<button onClick={handleErrors}>submit</button>*/}
        </Rewards>

    )
}

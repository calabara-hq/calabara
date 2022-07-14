import React, { useState, useEffect, useReducer } from "react";
import styled, { keyframes } from 'styled-components'
import CounterButton from "./CounterButton";
import RewardSelector from "./choose-rewards";
import VoterRewardsBlock from "./voter-rewards";
import contestLogo from '../../../../img/creator-contest.png'
import { HelpText } from "react-rainbow-components";
import { Contest_h2, Contest_h3, fade_in } from '../common/common_styles'

const Rewards = styled.div`
    display: flex;
    flex-direction: column;
    color: #d3d3d3;
    grid-gap: 50px;
    width: 100%;
    margin: 0 auto;

`

const RewardsMainHeading = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 33%);
    grid-row-gap: 30px;    
    grid-template-areas: "heading . logo"
                         "rewards rewards rewards";

`

const SubmitterRewardsGridLayout = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-row-gap: 20px;
    text-align: center;
    position: relative;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 30px;
    border-bottom: 1px solid grey;
`

const SubmitterRewardsHeading = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: 1fr 1fr;
    grid-template-areas: "section_title ."
                         "title num_winners";
    align-items: center;
    grid-row-gap: 20px;
    text-align: left;
    width: 90%;
    margin: 0 auto;
    animation: ${fade_in} 0.6s ease-in-out;
`

const GridInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    grid-gap: 10px;
    flex-wrap: wrap;
    
`

const RewardsGridInput = styled.input`
    border: 2px solid ${props => props.error ? 'red' : props.theme.palette.rewards_text[props.name]};
    border-radius: 10px;
    background-color: black;
    outline: none;
    padding: 5px 10px;
    width: 20%;
    justify-self: center;
    align-self: center;
    text-align: center;
    animation: ${fade_in} ${props => props.name * 0.7}s ease-in-out;

    &:focus, &:hover, &:active{
        border: 2px solid ${props => props.theme.palette.brand};
    }
`

export default function ContestRewardsBlock({ theme, rewardOptions, setRewardOptions, selectedRewards, setSelectedRewards, submitterRewards, setSubmitterRewards, voterRewards, setVoterRewards, errorMatrix, setErrorMatrix }) {
    const [numWinners, setNumWinners] = useState(1)

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

    const handleWinnersIncrement = () => {
        if (numWinners < 10) {
            setNumWinners(numWinners + 1);
            let errorMatrix = Array.from({ length: numWinners + 1 }, () => Array.from({ length: 4 }, () => null))
            setErrorMatrix(errorMatrix)
        }
    }
    const handleWinnersDecrement = (value) => {
        if (numWinners > 1) {
            let rewards_copy = Object.entries(submitterRewards)
            rewards_copy.pop();
            rewards_copy = Object.fromEntries(rewards_copy)
            setSubmitterRewards({ type: 'update_all', payload: rewards_copy })
            setNumWinners(numWinners - 1);
            let errorMatrix = Array.from({ length: numWinners - 1 }, () => Array.from({ length: 4 }, () => null))
            setErrorMatrix(errorMatrix)
        }
    }

    const isVoterBlockVisible = () => {
        if(selectedRewards['erc721'] &&  Object.keys(selectedRewards).length === 1) return false
        return true
    }

    return (
        <Rewards theme={theme}>
            <RewardsMainHeading>
                <Contest_h2 grid_area={'heading'}>Contest Rewards</Contest_h2>
                <img style={{ gridArea: 'logo', width: '20em', marginTop: '20px', marginLeft: 'auto' }} src={contestLogo}></img>
                <RewardSelector rewardOptions={rewardOptions} setRewardOptions={setRewardOptions} selectedRewards={selectedRewards} setSelectedRewards={setSelectedRewards}/>
            </RewardsMainHeading>


            {Object.keys(selectedRewards).length > 0 &&
                <>
                    <SubmitterRewardsHeading>
                        <Contest_h2 grid_area={'section_title'}>submitter rewards</Contest_h2>
                        <Contest_h3 grid_area={'title'}>Number of Winners</Contest_h3>
                        <CounterButton grid_area={'num_winners'} counter={numWinners} handleIncrement={handleWinnersIncrement} handleDecrement={handleWinnersDecrement} />
                    </SubmitterRewardsHeading>
                    <SubmitterRewardsGridLayout>
                        <SubmitterRewardsGrid numWinners={numWinners} submitterRewards={submitterRewards} setSubmitterRewards={setSubmitterRewards} selectedRewards={selectedRewards} errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix} theme={theme} />
                    </SubmitterRewardsGridLayout>
                    {isVoterBlockVisible() && <VoterRewardsBlock num_voting_rewards={Object.values(submitterRewards)} submitter_rewards={Object.values(submitterRewards)} selectedRewards={selectedRewards} voterRewards={voterRewards} setVoterRewards={setVoterRewards} />}
                </>
            }
            {/*<button onClick={handleErrors}>submit</button>*/}
        </Rewards>

    )
}

function SubmitterRewardsGrid({ numWinners, selectedRewards, submitterRewards, setSubmitterRewards, errorMatrix, setErrorMatrix, theme }) {

    return (
        <>
            <p>Rank</p>
            {selectedRewards.ETH ? <p>{selectedRewards.ETH}</p> : <b></b>}
            {selectedRewards.erc20 ? <p>{selectedRewards.erc20}</p> : <b></b>}
            {selectedRewards.erc721 ? <p>{selectedRewards.erc721}</p> : <b></b>}
            {
                Array.from(Array(numWinners)).map((val, idx) => {
                    return (
                        <RewardGridRow idx={idx} theme={theme} val={val} submitterRewards={submitterRewards} setSubmitterRewards={setSubmitterRewards} selectedRewards={selectedRewards} errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix} />
                    )
                })
            }
        </>
    )
}

function RewardGridRow({ theme, idx, submitterRewards, setSubmitterRewards, selectedRewards, errorMatrix, setErrorMatrix }) {

    const updateRewards = (e) => {
        const { name, value } = e.target;
        let err_matrix_copy = JSON.parse(JSON.stringify(errorMatrix))
        switch (name) {
            case '0':
                setSubmitterRewards({ type: 'update_single', payload: { [idx]: Object.assign(submitterRewards[idx] || {}, { rank: Number(value) }) } })
                err_matrix_copy[idx][0] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '1':
                setSubmitterRewards({ type: 'update_single', payload: { [idx]: Object.assign(submitterRewards[idx] || {}, { eth: {amount: Number(value) || 0, contract: null, sybmol: 'ETH'} }) } })
                err_matrix_copy[idx][1] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '2':
                setSubmitterRewards({ type: 'update_single', payload: { [idx]: Object.assign(submitterRewards[idx] || {}, { erc20: {amount: Number(value) || 0, contract: 'blahblahblah', sybmol: 'SHARK'} }) } })
                err_matrix_copy[idx][2] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '3':
                setSubmitterRewards({ type: 'update_single', payload: { [idx]: Object.assign(submitterRewards[idx] || {}, { erc721: {amount: Number(value) || 0, contract: 'nounshshshsh', sybmol: 'NOUN'} }) } })
                err_matrix_copy[idx][3] = null
                setErrorMatrix(err_matrix_copy)
                break;
        }

    }

    return (

        <>

            <GridInputContainer>
                <RewardsGridInput name='0' theme={theme} type="number" onChange={updateRewards} onWheel={(e) => e.target.blur()}></RewardsGridInput>
                {errorMatrix[idx][0] && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][0]}</p>} />}

            </GridInputContainer>

            <GridInputContainer>
                {selectedRewards.ETH ?
                    <RewardsGridInput name='1' theme={theme} type="number" onChange={updateRewards} onWheel={(e) => e.target.blur()}></RewardsGridInput>
                    : <b></b>
                }
                {errorMatrix[idx][1] && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][1]}</p>} />}

            </GridInputContainer>

            <GridInputContainer>
                {selectedRewards.erc20 ?
                    <RewardsGridInput name='2' theme={theme} type="number" onChange={updateRewards} onWheel={(e) => e.target.blur()}></RewardsGridInput>
                    : <b></b>
                }
                {errorMatrix[idx][2] && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][2]}</p>} />}

            </GridInputContainer>

            <GridInputContainer>
                {selectedRewards.erc721 ?
                    <RewardsGridInput name='3' theme={theme} type="number" onChange={updateRewards} error={errorMatrix[idx][3]} onWheel={(e) => e.target.blur()} ></RewardsGridInput>
                    : <b></b>
                }
                {errorMatrix[idx][3] && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][3]}</p>} />}
            </GridInputContainer>
        </>
    )

}
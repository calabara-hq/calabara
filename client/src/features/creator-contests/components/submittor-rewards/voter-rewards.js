import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Picklist, Option, ProgressStep } from 'react-rainbow-components';
import CounterButton from './CounterButton';
import Select, { NonceProvider } from 'react-select'
import { Contest_h2, Contest_h3 } from '../common/common_styles';


const fade_in = keyframes`
    0% {opacity: 0}
    100% {opacity: 1}
`

const TopGridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-areas: "section_title voter_winners counter .";
    grid-row-gap: 20px;
    text-align: center;
    height: 5em;
`
const VotingRewardSelectorWrap = styled.div`
    display: grid;
    flex-direction: column;
    grid-gap: 10px;
    width: 90%;
    margin: 0 auto;
    animation: ${fade_in} 0.6s ease-in-out;

`
const RewardRowWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-gap: 10px;
    justify-content: center;
    align-items: center;
    text-align: center;
`

const VoterRewardInput = styled.div`
    border: 1px solid blue;
    border-radius: 100px;
    background-color: black;
    outline: none;
    padding: 5px 10px;
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
`

const VoterRankWrapper = styled.div`
    border: 1px solid blue;
    border-radius: 100px;
    background-color: black;
    outline: none;
    padding: 5px 10px;
    width: fit-content;
    justify-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`

const RewardsGridInput = styled.input`
    border: none;
    outline: none;
    background-color: transparent;
    padding: 5px 10px;
    justify-self: center;
    align-self: center;
    width: 50%;
`

export default function VoterRewardsBlock({ num_voting_rewards, rewardOptions, voterRewards, setVoterRewards }) {
    const [isToggleOn, setIsToggleOn] = useState(false)

    // allow voting rewards for ranks 1 -> 10
    let possible_ranks = Array.from({ length: 10 }, (_, i) => { return { value: i + 1, label: i + 1 } })

    // don't allow nft rewards (can't be fractionalized)
    let { erc721, ...valid_rewards } = rewardOptions
    let possible_rewards = Object.values(valid_rewards).map((el) => { return { value: el, label: el } })

    const [numVoterRewards, setNumVoterRewards] = useState(1)

    const handleVoterRewardsIncrement = () => {
        if (numVoterRewards < 10) setNumVoterRewards(numVoterRewards + 1)
    }

    const handleVoterRewardsDecrement = () => {
        if (numVoterRewards > 1) setNumVoterRewards(numVoterRewards - 1)
    }


    return (
        <>
            <TopGridWrapper>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gridGap: '20px' }}>
                    <Contest_h2 grid_area={'section_title'} animated={true}>voter rewards</Contest_h2>
                    <VoterRewardsToggle isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn} />
                </div>
                {isToggleOn &&
                    <>
                        <Contest_h3 grid_area={'voter_winners'} animated={true}>Number of Winners</Contest_h3>
                        <CounterButton style={{ gridArea: 'counter' }} counter={numVoterRewards} handleIncrement={handleVoterRewardsIncrement} handleDecrement={handleVoterRewardsDecrement} />
                    </>
                }
            </TopGridWrapper>
            {isToggleOn &&
                <VotingRewardSelectorWrap>
                    {Array.from(Array(numVoterRewards)).map((el, idx) => {
                        return <VotingRewardsRow index={idx} possible_ranks={possible_ranks} possible_rewards={possible_rewards} voterRewards={voterRewards} setVoterRewards={setVoterRewards} />
                    })}
                </VotingRewardSelectorWrap>
            }
        </>
    )
}


function VoterRewardsToggle({ isToggleOn, setIsToggleOn }) {

    const handleToggle = () => {

        if (!isToggleOn) {
            setIsToggleOn(true)
        }
        else {
            setIsToggleOn(false)
        }
    }

    return (
        <div className="gatekeeper-toggle">
            <input checked={isToggleOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle`} type="checkbox" />
            <label style={{ background: isToggleOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}

function VotingRewardsRow({ possible_ranks, possible_rewards, index, voterRewards, setVoterRewards }) {

    const customSelectorStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'transparent',
            border: 'none',
            borderColor: 'transparent',
            boxShadow: 'none',
            color: 'white',
            cursor: 'pointer',
            justifyContent: 'center',
        }),

        indicatorContainer: (provided, state) => ({
            ...provided,
            padding: '0px'
        }),

        valueContainer: (provided, state) => ({
            ...provided,
            overflow: 'visible',
            fontSize: '14px',
            color: '#d3d3d3',
            padding: '3px 0px',
            minWidth: '6ch',
            padding: '2px',
            borderLeft: provided.selectType === 'reward' ? '1px solid white' : 'null'
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: '#d3d3d3',

        }),
        option: (provided, state) => ({
            ...provided,
            cursor: 'pointer',
            color: 'black'

        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            width: '10'

        }),
    }


    const handleRankUpdate = (value) => {
        setVoterRewards({ type: 'update_single', payload: { [index]: Object.assign(voterRewards[index] || {}, { 'rank': value }) } })
    }

    const handleRewardTypeUpdate = (value) => {
        setVoterRewards({ type: 'update_single', payload: { [index]: Object.assign(voterRewards[index] || {}, { 'reward_type': value }) } })
    }

    const handleRewardUpdate = (e) => {
        setVoterRewards({ type: 'update_single', payload: { [index]: Object.assign(voterRewards[index] || {}, { 'reward': e.target.value }) } })

    }

    return (

        <RewardRowWrapper>
            <h4>voters that accurately choose rank </h4>
            <VoterRankWrapper>
                <Select
                    styles={customSelectorStyles}
                    components={{ IndicatorSeparator: () => null }}
                    selectType={'rank'}
                    options={possible_ranks}
                    onChange={(e) => { handleRankUpdate(e.value) }}
                    defaultValue={{ value: '1', label: '1' }} />
            </VoterRankWrapper>
            <h4>will split </h4>
            <VoterRewardInput>
                <RewardsGridInput type="number" onChange={(e) => { handleRewardUpdate(e) }} onWheel={(e) => e.target.blur()} />
                <Select
                    styles={customSelectorStyles}
                    components={{ IndicatorSeparator: () => null }}
                    selectType={'reward'}
                    options={possible_rewards}
                    onChange={(e) => { handleRewardTypeUpdate(e.value) }}
                    defaultValue={{ value: possible_rewards[0].value, label: possible_rewards[0].label }} />
            </VoterRewardInput>

        </RewardRowWrapper>
    )
}



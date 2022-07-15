import React, { useState, useEffect } from 'react'
import CounterButton from '../../common/CounterButton';
import Select from 'react-select'
import { Contest_h2, Contest_h3, Contest_h4, SettingsSectionSubHeading } from '../../common/common_styles';
import { ToggleButton } from '../../common/common_components';
import {
    customSelectorStyles,
    VotingRewardSelectorWrap,
    RewardRowWrapper,
    VoterRewardInput,
    VoterRankWrapper,
    RewardsGridInput,
    HeadingWithToggle
} from './voter-rewards-style';
import { NumberWinnersContainer, RewardsMainContent, RewardTypeWrap } from '../reward-styles';


export default function VoterRewardsBlock({ selectedRewards, voterRewards, setVoterRewards }) {
    const [isToggleOn, setIsToggleOn] = useState(false)


    // allow voting rewards for ranks 1 -> 10
    let possible_ranks = Array.from({ length: 10 }, (_, i) => { return { value: i + 1, label: i + 1 } })

    // don't allow nft rewards (can't be fractionalized)
    let { erc721, ...valid_rewards } = selectedRewards
    let possible_rewards = Object.values(valid_rewards).map((el) => { return { value: el, label: el } })

    const [numVoterRewards, setNumVoterRewards] = useState(1)

    const handleVoterRewardsIncrement = () => {
        if (numVoterRewards < 10) setNumVoterRewards(numVoterRewards + 1)
    }

    const handleVoterRewardsDecrement = () => {
        if (numVoterRewards > 1) setNumVoterRewards(numVoterRewards - 1)
    }

    const handleToggle = () => {
        if (!isToggleOn) {
            setIsToggleOn(true)
        }
        else {
            setIsToggleOn(false)
        }
    }



    return (
        <RewardTypeWrap>
            <SettingsSectionSubHeading>
                <HeadingWithToggle>
                    <Contest_h2 style={{ marginRight: '4em' }} animated={true}>voter rewards</Contest_h2>
                    <ToggleButton identifier={'voter-rewards-toggle'} isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn} handleToggle={handleToggle} />
                </HeadingWithToggle>
            </SettingsSectionSubHeading>
            {isToggleOn && <RewardsMainContent>
                <NumberWinnersContainer>
                    <Contest_h3 animated={true}>Number of Winners</Contest_h3>
                    <CounterButton counter={numVoterRewards} handleIncrement={handleVoterRewardsIncrement} handleDecrement={handleVoterRewardsDecrement} />
                </NumberWinnersContainer>
                <VotingRewardSelectorWrap>
                    {Array.from(Array(numVoterRewards)).map((el, idx) => {
                        return <VotingRewardsRow index={idx} possible_ranks={possible_ranks} possible_rewards={possible_rewards} voterRewards={voterRewards} setVoterRewards={setVoterRewards} />
                    })}
                </VotingRewardSelectorWrap>
            </RewardsMainContent>}
        </RewardTypeWrap>
    )
}



function VotingRewardsRow({ possible_ranks, possible_rewards, index, voterRewards, setVoterRewards }) {
    const [rank, setRank] = useState(1);
    const [reward_type, setRewardType] = useState(null)
    const [reward, setReward] = useState(0)


    useEffect(() => {
        setVoterRewards({ type: 'update_single', payload: { [index]: Object.assign(voterRewards[index] || {}, { rank: rank, [reward_type]: { amount: Number(reward), contract: 'xyz', symbol: 'xyz' } }) } })
    }, [rank, reward_type, reward])

    return (

        <RewardRowWrapper>
            <Contest_h4>voters that accurately choose rank </Contest_h4>
            <VoterRankWrapper>
                <Select
                    styles={customSelectorStyles}
                    components={{ IndicatorSeparator: () => null }}
                    selectType={'rank'}
                    options={possible_ranks}
                    onChange={(e) => { setRank(e.value) }}
                    defaultValue={{ value: 1, label: 1 }} />
            </VoterRankWrapper>
            <Contest_h4>will split </Contest_h4>
            <VoterRewardInput>
                <RewardsGridInput type="number" onChange={(e) => { setReward(e.target.value) }} onWheel={(e) => e.target.blur()} />
                <Select
                    styles={customSelectorStyles}
                    components={{ IndicatorSeparator: () => null }}
                    selectType={'reward'}
                    options={possible_rewards}
                    onChange={(e) => { setRewardType(e.value) }}
                    defaultValue={{ value: possible_rewards[0].value, label: possible_rewards[0].label }} />
            </VoterRewardInput>

        </RewardRowWrapper>
    )
}



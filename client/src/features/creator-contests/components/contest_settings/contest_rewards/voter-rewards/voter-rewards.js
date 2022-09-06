import React, { useState, useEffect, useCallback } from 'react'
import CounterButton from '../../../common/CounterButton';
import Select from 'react-select'
import { Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt, Contest_h3_alt_small, Contest_h4, SettingsSectionSubHeading } from '../../../common/common_styles';
import { ToggleButton } from '../../../common/common_components';
import { rewardOptionsActions, rewardOptionsState } from '../reducers/reward-options-reducer';
import { voterRewardsActions, voterRewardsState } from '../reducers/voter-rewards-reducer';
import { useSelector, useDispatch } from 'react-redux';
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


export default function VoterRewardsBlock({ voterRewards, setVoterRewards }) {
    const [isToggleOn, setIsToggleOn] = useState(false);
    const rewardOptions = useSelector(rewardOptionsState.getRewardOptions)
    const selectedRewards = useSelector(rewardOptionsState.getSelectedRewards)
    const numVoterRewards = useSelector(voterRewardsState.getNumWinners)
    const dispatch = useDispatch();


    // clear voter rewards if selected rewards gets flipped off
    useEffect(() => {
        if (Object.values(selectedRewards).length === 0) {
            dispatch(voterRewardsActions.clearRewardOptions())
        }
    }, [selectedRewards])


    // allow voting rewards for ranks 1 -> 10
    let possible_ranks = Array.from({ length: 10 }, (_, i) => { return { value: i + 1, label: i + 1 } })

    // don't allow nft rewards (can't be fractionalized)
    let { erc721, ...valid_rewards } = selectedRewards
    let possible_rewards = Object.values(valid_rewards).map((el) => { return { value: el.type, label: el.symbol } })


    const handleVoterRewardsIncrement = () => {
        if (numVoterRewards < 10) dispatch(voterRewardsActions.incrementWinners())
    }

    const handleVoterRewardsDecrement = () => {
        if (numVoterRewards > 1) dispatch(voterRewardsActions.decrementWinners())
    }

    const handleToggle = () => {
        if (isToggleOn) {
            dispatch(voterRewardsActions.clearRewardOptions())
        }
        setIsToggleOn(!isToggleOn)
    }



    return (
        <RewardTypeWrap>
            <SettingsSectionSubHeading>
                <HeadingWithToggle>
                    <Contest_h3_alt style={{ marginRight: '4em' }} animated={true}>Voter Rewards</Contest_h3_alt>
                    <ToggleButton identifier={'voter-rewards-toggle'} isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn} handleToggle={handleToggle} />
                </HeadingWithToggle>
            </SettingsSectionSubHeading>
            {isToggleOn && <RewardsMainContent>
                <NumberWinnersContainer>
                    <Contest_h3_alt_small animated={true}>Number of Winners</Contest_h3_alt_small>
                    <CounterButton counter={numVoterRewards} handleIncrement={handleVoterRewardsIncrement} handleDecrement={handleVoterRewardsDecrement} />
                </NumberWinnersContainer>
                <VotingRewardSelectorWrap>
                    {Array.from(Array(numVoterRewards)).map((el, idx) => {
                        return <VotingRewardsRow rewardOptions={rewardOptions} index={idx} possible_ranks={possible_ranks} possible_rewards={possible_rewards} voterRewards={voterRewards} setVoterRewards={setVoterRewards} />
                    })}
                </VotingRewardSelectorWrap>
            </RewardsMainContent>}
        </RewardTypeWrap>
    )
}



function VotingRewardsRow({ rewardOptions, possible_ranks, possible_rewards, index }) {
    const [rank, setRank] = useState(1);
    const [reward_type, setRewardType] = useState('eth')
    const [reward, setReward] = useState(0)
    const dispatch = useDispatch();
    const voterRewards = useSelector(voterRewardsState.getvoterRewards)

    useEffect(() => {
        dispatch(voterRewardsActions.updatevoterRewards(
            {
                index: index,
                value: {
                    [reward_type]: { ...rewardOptions[reward_type], amount: Number(reward) },
                    rank: rank
                }
            }))

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



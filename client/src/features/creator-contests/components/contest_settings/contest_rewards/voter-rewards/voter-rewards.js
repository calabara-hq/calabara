import React, { useState, useEffect, useCallback } from 'react'
import CounterButton from '../../../common/CounterButton';
import Select from 'react-select'
import { Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt, Contest_h3_alt_small, Contest_h4, SettingsSectionSubHeading } from '../../../common/common_styles';
import { ToggleButton } from '../../../common/common_components';
import { rewardOptionState, voterRewardActions, voterRewardState } from '../reducers/rewards-reducer';
import { useSelector, useDispatch } from 'react-redux';
import {
    VotingRewardSelectorWrap,
    RewardRowWrapper,
    VoterRewardInput,
    VoterRankWrapper,
    RewardsGridInput,
    HeadingWithToggle,
    RewardTypeButtons,
    VoterRewardTypeButton,
} from './voter-rewards-style';
import { AddRewardButton, DeleteRewardButton } from '../reward-styles'
import { NumberWinnersContainer, RewardsMainContent, RewardTypeWrap } from '../reward-styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { HelpText } from 'react-rainbow-components';


export default function VoterRewardsBlock({ theme }) {
    const [isToggleOn, setIsToggleOn] = useState(false);
    const rewardOptions = useSelector(rewardOptionState.getRewardOptions)
    const selectedRewards = useSelector(rewardOptionState.getSelectedRewards)
    const numVoterRewards = useSelector(voterRewardState.getNumVoterWinners)
    const dispatch = useDispatch();




    // allow voting rewards for ranks 1 -> 10
    let possible_ranks = Array.from({ length: 10 }, (_, i) => { return { value: i + 1, label: i + 1 } })

    // don't allow nft rewards (can't be fractionalized)
    let { erc721, ...valid_rewards } = selectedRewards
    let possible_rewards = Object.values(valid_rewards).map((el) => { return { value: el.type, label: el.symbol } })


    const handleVoterRewardsIncrement = () => dispatch(voterRewardActions.incrementVoterWinners());


    const handleToggle = () => {
        setIsToggleOn(!isToggleOn)
        dispatch(voterRewardActions.toggleVoterRewards())
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
                <VotingRewardSelectorWrap>
                    {Array.from(Array(numVoterRewards)).map((el, idx) => {
                        { return <VotingRewardsRow selectedRewards={selectedRewards} index={idx} possible_ranks={possible_ranks} possible_rewards={possible_rewards} theme={theme} handleToggle={handleToggle} /> }
                    })}
                    <AddRewardButton onClick={handleVoterRewardsIncrement}>add</AddRewardButton>
                </VotingRewardSelectorWrap>
            </RewardsMainContent>}
        </RewardTypeWrap>
    )
}



function VotingRewardsRow({ selectedRewards, possible_ranks, possible_rewards, index, theme, handleToggle }) {
    const [rank, setRank] = useState(0);
    const [reward_type, setRewardType] = useState(possible_rewards[0].value)
    const [reward, setReward] = useState(0)
    const dispatch = useDispatch();
    const numVoterRewards = useSelector(voterRewardState.getNumVoterWinners)
    const errorMatrix = useSelector(voterRewardState.getVoterErrors)

    useEffect(() => {
        dispatch(voterRewardActions.updateVoterRewards(
            {
                index: index,
                value: {
                    [reward_type]: { ...selectedRewards[reward_type], amount: Number(reward) },
                    rank: rank
                }
            }))

    }, [rank, reward_type, reward])


    const updateRank = (e) => {
        const rank = Math.floor(e.target.value)
        setRank(Math.round(Math.abs(rank)) || '')
    }

    const updateReward = (e) => {
        setReward(Math.abs(e.target.value) || '')
    }

    const handleRemoveReward = () => {
        // if this is the only row, flip voter rewards off
        if ((index === 0) && (numVoterRewards === 1)) return handleToggle();
        // otherwise handle like normal
        dispatch(voterRewardActions.removeVoterReward(index))
    }

    return (

        <RewardRowWrapper>
            <Contest_h4>voters that accurately choose rank </Contest_h4>
            <RewardsGridInput error={errorMatrix[index][0]} theme={theme} name='1' placeholder='rank' type="number" onChange={updateRank} value={rank || ''} onWheel={(e) => e.target.blur()}></RewardsGridInput>
            <Contest_h4>will split </Contest_h4>
            <RewardsGridInput error={errorMatrix[index][1]} theme={theme} name='1' placeholder='amount' type="number" onChange={updateReward} value={reward || ''} onWheel={(e) => e.target.blur()}></RewardsGridInput>
            <RewardTypeButtons>
                {possible_rewards.map(reward => {
                    return <VoterRewardTypeButton selected={reward_type === reward.value} onClick={() => setRewardType(reward.value)}>{reward.label}</VoterRewardTypeButton>
                })}
            </RewardTypeButtons>
            {(errorMatrix[index][0] || errorMatrix[index][1]) && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>
                {errorMatrix[index][0] && errorMatrix[index][0]}
                {errorMatrix[index][1] && errorMatrix[index][1]}
            </p>} />
            }
            <DeleteRewardButton onClick={handleRemoveReward}><FontAwesomeIcon icon={faTimesCircle} /></DeleteRewardButton>
        </RewardRowWrapper>
    )
}



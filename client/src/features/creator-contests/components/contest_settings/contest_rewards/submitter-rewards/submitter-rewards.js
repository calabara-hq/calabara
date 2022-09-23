import React, { useState, useEffect } from 'react';
import { Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt, Contest_h3_alt_small, SettingsSectionSubHeading } from '../../../common/common_styles';
import { SubmitterRewardsGridLayout, GridContainer, RewardsGridInput, CounterContainer } from './submitter-rewards-style';
import CounterButton from '../../../common/CounterButton';
import { HelpText } from 'react-rainbow-components';
import { RewardTypeWrap, NumberWinnersContainer, RewardsMainContent, AddRewardButton, DeleteRewardButton } from '../reward-styles';
import { rewardOptionActions, rewardOptionState, submitterRewardActions, submitterRewardState } from '../reducers/rewards-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { blue } from '@mui/material/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function SubmitterRewardsBlock({ setErrorMatrix, theme }) {
    const selectedRewards = useSelector(rewardOptionState.getSelectedRewards)
    const numWinners = useSelector(submitterRewardState.getNumSubmissionWinners)
    const errorMatrix = useSelector(submitterRewardState.getSubmitterErrors)




    return (
        <RewardTypeWrap>

            <SettingsSectionSubHeading>
                <Contest_h3_alt grid_area={'section_title'}>Submitter Rewards</Contest_h3_alt>
            </SettingsSectionSubHeading>
            <RewardsMainContent>
                <SubmitterRewardsGrid numWinners={numWinners} selectedRewards={selectedRewards} errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix} theme={theme} />
            </RewardsMainContent>

        </RewardTypeWrap>
    )
}

function SubmitterRewardsGrid({ numWinners, selectedRewards, errorMatrix, theme }) {
    const dispatch = useDispatch();

    const handleWinnersIncrement = () => dispatch(submitterRewardActions.incrementSubmitterWinners())


    return (
        <SubmitterRewardsGridLayout>
            <GridContainer style={{ width: '50%' }}><p>Rank</p></GridContainer>
            <GridContainer>{selectedRewards.eth ? <p>{selectedRewards.eth.symbol}</p> : <b></b>}</GridContainer>
            <GridContainer>{selectedRewards.erc20 ? <p>{selectedRewards.erc20.symbol}</p> : <b></b>}</GridContainer>
            <GridContainer>{selectedRewards.erc721 ? <p>{selectedRewards.erc721.symbol}</p> : <b></b>}</GridContainer>
            <GridContainer><b></b></GridContainer>
            <GridContainer><b></b></GridContainer>
            {Array.from(Array(numWinners)).map((val, idx) => {
                return (
                    <RewardGridRow key={idx} idx={idx} theme={theme} val={val} selectedRewards={selectedRewards} errorMatrix={errorMatrix} />
                )
            })}
            <GridContainer style={{ justifySelf: 'flex-start' }}><AddRewardButton onClick={handleWinnersIncrement}>add</AddRewardButton></GridContainer>

        </SubmitterRewardsGridLayout>
    )
}

function RewardGridRow({ theme, idx, selectedRewards, errorMatrix }) {
    const dispatch = useDispatch();
    const rewardOptions = useSelector(rewardOptionState.getRewardOptions)
    const numWinners = useSelector(submitterRewardState.getNumSubmissionWinners)

    const handleRemoveReward = () => {
        if ((idx === 0) && (numWinners === 1)) return dispatch(rewardOptionActions.clearSelectedRewards())
        dispatch(submitterRewardActions.removeSubmitterReward(idx))

    }

    const updateRewards = (e) => {

        const { name, value } = e.target;
        switch (name) {
            case 'rank':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'rank', value: Number(value) }))
                break;
            case 'eth':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'eth', value: { type: 'eth', symbol: 'ETH', address: null, amount: Number(value) } }))
                break;
            case 'erc20':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'erc20', value: { type: 'erc20', symbol: rewardOptions.erc20.symbol, address: rewardOptions.erc20.address, decimal: rewardOptions.erc20.decimal, amount: Number(value) } }))
                break;
            case 'erc721':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'erc721', value: { type: 'erc721', symbol: rewardOptions.erc721.symbol, address: rewardOptions.erc721.address, decimal: rewardOptions.erc721.decimal, token_id: Number(value) } }))
                break;
        }

    }

    return (

        <>

            <GridContainer style={{ width: '60%' }}>
                <RewardsGridInput error={errorMatrix[idx][0]} name='rank'  placeholder='rank' theme={theme} type="number" onChange={updateRewards} onWheel={(e) => e.target.blur()}></RewardsGridInput>

            </GridContainer>

            <GridContainer>
                {selectedRewards.eth ?
                    <RewardsGridInput error={errorMatrix[idx][1]} name='eth' theme={theme} type="number" placeholder='amount' onChange={updateRewards} onWheel={(e) => e.target.blur()}></RewardsGridInput>
                    : <b></b>
                }

            </GridContainer>

            <GridContainer>
                {selectedRewards.erc20 ?
                    <RewardsGridInput error={errorMatrix[idx][1]} name='erc20' theme={theme} type="number" placeholder='amount' onChange={updateRewards} onWheel={(e) => e.target.blur()}></RewardsGridInput>
                    : <b></b>
                }

            </GridContainer>

            <GridContainer>
                {selectedRewards.erc721 ?
                    <RewardsGridInput error={errorMatrix[idx][1]} name='erc721' theme={theme} type="number" placeholder='token id' onChange={updateRewards} onWheel={(e) => e.target.blur()} ></RewardsGridInput>
                    : <b></b>
                }
            </GridContainer>
            {errorMatrix[idx][0] || errorMatrix[idx][1] ?
                <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>
                    {errorMatrix[idx][0] && errorMatrix[idx][0]}
                    {errorMatrix[idx][1] && errorMatrix[idx][1]}
                </p>} />
                :
                <b></b>}
            {((idx === 0) && (numWinners === 1)) ? <b></b> : <GridContainer style={{ justifySelf: 'flex-end' }}><DeleteRewardButton onClick={handleRemoveReward}><FontAwesomeIcon icon={faTimesCircle} /></DeleteRewardButton></GridContainer>}

        </>
    )

}
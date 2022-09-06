import React, { useState, useEffect } from 'react';
import { Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt, Contest_h3_alt_small, SettingsSectionSubHeading } from '../../../common/common_styles';
import { SubmitterRewardsGridLayout, GridInputContainer, RewardsGridInput, CounterContainer } from './submitter-rewards-style';
import CounterButton from '../../../common/CounterButton';
import { HelpText } from 'react-rainbow-components';
import { RewardTypeWrap, NumberWinnersContainer, RewardsMainContent } from '../reward-styles';
import { rewardOptionsActions, rewardOptionsState } from '../reducers/reward-options-reducer';
import { submitterRewardActions, submitterRewardsState } from '../reducers/submitter-rewards-reducer';
import { useDispatch, useSelector } from 'react-redux';

export default function SubmitterRewardsBlock({ errorMatrix, setErrorMatrix, theme }) {
    const selectedRewards = useSelector(rewardOptionsState.getSelectedRewards)
    const numWinners = useSelector(submitterRewardsState.getNumWinners)
    const dispatch = useDispatch();

    useEffect(() => {
        
    }, [numWinners])

    const handleWinnersIncrement = () => {
        if (numWinners < 10) {
            dispatch(submitterRewardActions.incrementWinners())
            let errorMatrix = Array.from({ length: numWinners + 1 }, () => Array.from({ length: 4 }, () => null))
            setErrorMatrix(errorMatrix)
        }
    }
    const handleWinnersDecrement = (value) => {
        if (numWinners > 1) {
            dispatch(submitterRewardActions.decrementWinners())
            let errorMatrix = Array.from({ length: numWinners - 1 }, () => Array.from({ length: 4 }, () => null))
            setErrorMatrix(errorMatrix)
        }
    }


    return (
        <RewardTypeWrap>

            <SettingsSectionSubHeading>
                <Contest_h3_alt grid_area={'section_title'}>Submitter Rewards</Contest_h3_alt>
            </SettingsSectionSubHeading>
            <RewardsMainContent>
                <NumberWinnersContainer>
                    <Contest_h3_alt_small>Number of Winners</Contest_h3_alt_small>
                    <CounterButton counter={numWinners} handleIncrement={handleWinnersIncrement} handleDecrement={handleWinnersDecrement} />
                </NumberWinnersContainer>
                <SubmitterRewardsGrid numWinners={numWinners} selectedRewards={selectedRewards} errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix} theme={theme} />
            </RewardsMainContent>

        </RewardTypeWrap>
    )
}

function SubmitterRewardsGrid({ rewardOptions, numWinners, selectedRewards, errorMatrix, setErrorMatrix, theme }) {

    return (
        <SubmitterRewardsGridLayout>
            <p>Rank</p>
            {selectedRewards.eth ? <p>{selectedRewards.eth.symbol}</p> : <b></b>}
            {selectedRewards.erc20 ? <p>{selectedRewards.erc20.symbol}</p> : <b></b>}
            {selectedRewards.erc721 ? <p>{selectedRewards.erc721.symbol}</p> : <b></b>}
            {
                Array.from(Array(numWinners)).map((val, idx) => {
                    return (
                        <RewardGridRow idx={idx} theme={theme} val={val} selectedRewards={selectedRewards} errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix} />
                    )
                })
            }
        </SubmitterRewardsGridLayout>
    )
}

function RewardGridRow({ theme, idx, selectedRewards, errorMatrix, setErrorMatrix }) {
    const dispatch = useDispatch();
    const rewardOptions = useSelector(rewardOptionsState.getRewardOptions)
    const submitterRewards = useSelector(submitterRewardsState.getSubmitterRewards)

    const updateRewards = (e) => {

        const { name, value } = e.target;
        let err_matrix_copy = JSON.parse(JSON.stringify(errorMatrix))
        switch (name) {
            case '0':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'rank', value: Number(value) }))
                err_matrix_copy[idx][0] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '1':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'eth', value: { type: 'eth', symbol: 'ETH', address: null, amount: Number(value) } }))
                err_matrix_copy[idx][1] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '2':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'erc20', value: { type: 'erc20', symbol: rewardOptions.erc20.symbol, address: rewardOptions.erc20.address, decimal: rewardOptions.erc20.decimal, amount: Number(value) } }))
                err_matrix_copy[idx][2] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '3':
                dispatch(submitterRewardActions.updateSubmitterRewards({ index: idx, type: 'erc721', value: { type: 'erc721', symbol: rewardOptions.erc721.symbol, address: rewardOptions.erc721.address, decimal: rewardOptions.erc721.decimal, amount: Number(value) } }))
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
                {selectedRewards.eth ?
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
import React, { useState, useEffect } from 'react';
import { Contest_h2, Contest_h3, SettingsSectionSubHeading } from '../../common/common_styles';
import { SubmitterRewardsGridLayout, GridInputContainer, RewardsGridInput, CounterContainer } from './submitter-rewards-style';
import CounterButton from '../../common/CounterButton';
import { HelpText } from 'react-rainbow-components';
import { RewardTypeWrap, NumberWinnersContainer, RewardsMainContent } from '../reward-styles';

export default function SubmitterRewardsBlock({ errorMatrix, setErrorMatrix, submitterRewards, setSubmitterRewards, selectedRewards, theme }) {
    const [numWinners, setNumWinners] = useState(1)

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


    return (
        <RewardTypeWrap>
            <SettingsSectionSubHeading>
                <Contest_h2 grid_area={'section_title'}>submitter rewards</Contest_h2>
            </SettingsSectionSubHeading>
            <RewardsMainContent>
                <NumberWinnersContainer>
                    <Contest_h3>Number of Winners</Contest_h3>
                    <CounterButton counter={numWinners} handleIncrement={handleWinnersIncrement} handleDecrement={handleWinnersDecrement} />
                </NumberWinnersContainer>
                <SubmitterRewardsGrid numWinners={numWinners} submitterRewards={submitterRewards} setSubmitterRewards={setSubmitterRewards} selectedRewards={selectedRewards} errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix} theme={theme} />
            </RewardsMainContent>
        </RewardTypeWrap>
    )
}

function SubmitterRewardsGrid({ numWinners, selectedRewards, submitterRewards, setSubmitterRewards, errorMatrix, setErrorMatrix, theme }) {

    return (
        <SubmitterRewardsGridLayout>
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
        </SubmitterRewardsGridLayout>
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
                setSubmitterRewards({ type: 'update_single', payload: { [idx]: Object.assign(submitterRewards[idx] || {}, { eth: { amount: Number(value) || 0, contract: null, sybmol: 'ETH' } }) } })
                err_matrix_copy[idx][1] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '2':
                setSubmitterRewards({ type: 'update_single', payload: { [idx]: Object.assign(submitterRewards[idx] || {}, { erc20: { amount: Number(value) || 0, contract: 'blahblahblah', sybmol: 'SHARK' } }) } })
                err_matrix_copy[idx][2] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '3':
                setSubmitterRewards({ type: 'update_single', payload: { [idx]: Object.assign(submitterRewards[idx] || {}, { erc721: { amount: Number(value) || 0, contract: 'nounshshshsh', sybmol: 'NOUN' } }) } })
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
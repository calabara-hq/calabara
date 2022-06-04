import React, { useState, useEffect, useReducer } from "react";
import styled, { keyframes } from 'styled-components'
import NumWinnersButton from "./NumWinnersButton";
import RewardSelector from "./choose-rewards";
import contestLogo from '../../../../img/creator-contest.png'
import { HelpText } from "react-rainbow-components";
import { Grid } from "@mui/material";


const fade_in = keyframes`
    0% {opacity: 0}
    100% {opacity: 1}
`

const Rewards = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.palette.mainBackground};
    color: #d3d3d3;
    grid-gap: 50px;
    height: 100vh;
    width: 95vw;
    margin: 0 auto;

`

const RewardsGridTop = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 33%);
    grid-row-gap: 30px;    
    grid-template-areas: "heading . logo"
                         "rewards rewards rewards";

`

const RewardsGridBottom = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-row-gap: 20px;
    text-align: center;
    position: relative;

`

const NumWinnersBlock = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-areas: "title num_winners . .";
    grid-row-gap: 20px;
    text-align: center;
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

function reducer(state, action) {
    switch (action.type) {
        case 'update_single':
            return { ...state, ...action.payload };
        case 'update_all':
            return { ...action.payload }
        default:
            throw new Error();
    }
}


export default function SubmittorRewardsBlock({ theme }) {

    const [numWinners, setNumWinners] = useState(1)
    const [winners, setWinners] = useState([])

    const [rewardOptions, setRewardOptions] = useReducer(reducer, {});

    const [rewards, setRewards] = useReducer(reducer, {});

    const [errorMatrix, setErrorMatrix] = useState([]);

    const [rewardInputErrors, setRewardInputErrors] = useState({})

    useEffect(() => {
        console.log(errorMatrix)
    },[errorMatrix])

    useEffect(() => {
        console.log(rewardOptions)
    }, [rewardOptions])

    useEffect(() => {
        if (numWinners > 0) {
            const generateArray = Array.from(Array(Number(numWinners)).keys())
            setWinners(generateArray)
            let errorMatrix = Array.from({length: numWinners},()=> Array.from({length: 4}, () => null))
            setErrorMatrix(errorMatrix)

        }
        else {
            setWinners([])
            setErrorMatrix([[]])
        }
    }, [numWinners])

    const handleErrors = () => {
        let err_matrix_copy = JSON.parse(JSON.stringify(errorMatrix))
        let rewards_arr = Object.values(rewards)
        // check for non whole number nft allocations

        rewards_arr.map((row, index) => {
            if (row.erc721 % 1 > 0) {
                err_matrix_copy[index][3] = 'must be a whole number'
                //setRewardInputErrors({ error: true, index: index, field: 'erc721', msg: `must be a whole number` })
                //setRewardInputErrors({[]})
                setErrorMatrix(err_matrix_copy)
            }
        })
    }

    return (
        <Rewards theme={theme}>
            <RewardsGridTop>
                <h2 style={{ gridArea: 'heading', marginLeft: '10px', borderBottom: '1px solid grey', width: 'fit-content', padding: '5px' }}>Submittor Rewards</h2>
                <img style={{ gridArea: 'logo', width: '20em', marginTop: '20px', marginLeft: 'auto' }} src={contestLogo}></img>
                <RewardSelector rewardOptions={rewardOptions} setRewardOptions={setRewardOptions} />

            </RewardsGridTop>
            {Object.keys(rewardOptions).length > 0 &&
                <>
                    <NumWinnersBlock>
                        <h3 style={{ gridArea: 'title', justifySelf: 'center', alignSelf: 'center', marginRight: '55px' }}>Number of Winners</h3>
                        <NumWinnersButton numWinners={numWinners} setNumWinners={setNumWinners} rewards={rewards} setRewards={setRewards} />
                    </NumWinnersBlock>

                    <RewardsGridBottom>
                        <p>Rank</p>
                        {rewardOptions.ETH ? <p>{rewardOptions.ETH}</p> : <b></b>}
                        {rewardOptions.erc20 ? <p>{rewardOptions.erc20}</p> : <b></b>}
                        {rewardOptions.erc721 ? <p>{rewardOptions.erc721}</p> : <b></b>}
                        {winners.map((idx, val) => {
                            return (
                                <RewardGridRow idx={idx} theme={theme} val={val} rewards={rewards} setRewards={setRewards} rewardOptions={rewardOptions} errorMatrix={errorMatrix} setErrorMatrix={setErrorMatrix}/>
                            )
                        })}


                    </RewardsGridBottom>
                </>
            }
            <button onClick={handleErrors}>submit</button>
        </Rewards>

    )
}


function RewardGridRow({ theme, idx, rewards, setRewards, rewardOptions, errorMatrix, setErrorMatrix }) {

    const [errorMsg, setErrorMsg] = useReducer(reducer, { rank: '', ETH: '', erc20: '', erc721: '' })

    /*
    useEffect(() => {
        if (rewardInputErrors.index == idx) {
            setErrorMsg({ type: 'update_single', payload: { [rewardInputErrors.field]: rewardInputErrors.msg } })
        }
    }, [rewardInputErrors])
*/



    const updateRewards = (e) => {
        const { name, value } = e.target;
        let err_matrix_copy = JSON.parse(JSON.stringify(errorMatrix))
        switch (name) {
            case '0':
                setRewards({ type: 'update_single', payload: { [idx]: Object.assign(rewards[idx] || {}, { rank: Number(value) }) } })
                err_matrix_copy[idx][0] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '1':
                setRewards({ type: 'update_single', payload: { [idx]: Object.assign(rewards[idx] || {}, { eth: Number(value) || 0 }) } })
                err_matrix_copy[idx][1] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '2':
                setRewards({ type: 'update_single', payload: { [idx]: Object.assign(rewards[idx] || {}, { erc20: Number(value) || 0 }) } })
                err_matrix_copy[idx][2] = null
                setErrorMatrix(err_matrix_copy)
                break;
            case '3':
                setRewards({ type: 'update_single', payload: { [idx]: Object.assign(rewards[idx] || {}, { erc721: Number(value) || 0 }) } })
                err_matrix_copy[idx][3] = null
                setErrorMatrix(err_matrix_copy)
                break;
        }

    }

    return (
        <>

            <GridInputContainer>
                <RewardsGridInput name='0' theme={theme} type="number" onChange={updateRewards}></RewardsGridInput>
                {false && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][0]}</p>} />}

            </GridInputContainer>

            <GridInputContainer>
                {rewardOptions.ETH ?
                    <RewardsGridInput name='1' theme={theme} type="number" onChange={updateRewards}></RewardsGridInput>
                    : <b></b>
                }
                {false && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][1]}</p>} />}

            </GridInputContainer>

            <GridInputContainer>
                {rewardOptions.erc20 ?
                    <RewardsGridInput name='2' theme={theme} type="number" onChange={updateRewards}></RewardsGridInput>
                    : <b></b>
                }
                {false && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][2]}</p>} />}

            </GridInputContainer>

            <GridInputContainer>
                {rewardOptions.erc721 ?
                    <RewardsGridInput name='3' theme={theme} type="number" onChange={updateRewards} error={errorMatrix[idx][3]} ></RewardsGridInput>
                    : <b></b>
                }
                {errorMatrix[idx][3] && <HelpText variant="error" title="error" text={<p style={{ fontSize: '16px' }}>{errorMatrix[idx][3]}</p>} />}
            </GridInputContainer>
        </>
    )
}
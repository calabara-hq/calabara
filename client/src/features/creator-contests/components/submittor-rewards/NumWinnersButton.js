import React, { useState } from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    color: #d3d3d3;
    border: 2px solid black;
    width: 35%;
    height: 100%;
    border-radius: 100px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
`
const MainContainer = styled.div`
    grid-area: num_winners;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    grid-gap: 20px;
`

const MinusButton = styled.button`
    height: 100%;
    width: 50%;
    border-radius: 100px 0px 0px 100px;
    border: none;
    border-right: 3.5px solid #303030;
    outline: none;
    color: black;
    background-color: rgb(234, 140, 128);
    
    &:hover{
        background-color: rgba(234, 140, 128, 0.8);
    }
    &:active{
        transform: scale(0.98);
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
    }
`

const PlusButton = styled.button`
    height: 100%;
    width: 50%;
    border-radius: 0px 100px 100px 0px;
    border: none;
    border-left: 3.5px solid #303030;
    outline: none;
    color: black;
    background-color: rgb(169, 234, 128);

    &:hover{
        background-color: rgba(169, 234, 128, 0.8);
    }
    &:active{
        transform: scale(0.98);
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
    }
`

export default function NumWinnersButton({ numWinners, setNumWinners, rewards, setRewards }) {


    const handleIncrement = () => {
        if (numWinners < 10) {
            setNumWinners(numWinners + 1);
        }
    }
    const handleDecrement = (value) => {
        if (numWinners > 1) {
            let rewards_copy = Object.entries(rewards)
            rewards_copy.pop();
            rewards_copy = Object.fromEntries(rewards_copy)
            console.log(rewards_copy)
            setRewards({type: 'update_all', payload: rewards_copy})
            setNumWinners(numWinners - 1);
        }
    }
    return (
        <MainContainer>
            <h4>{numWinners}</h4>
            <ButtonContainer>
                <MinusButton onClick={handleDecrement}><FontAwesomeIcon icon={faMinus} /></MinusButton>
                <PlusButton onClick={handleIncrement}><FontAwesomeIcon icon={faPlus} /></PlusButton>
            </ButtonContainer>
        </MainContainer>
    );

}

import React, { useState } from 'react';
import styled, {keyframes} from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { fade_in } from './common_styles';

const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 5em;
    grid-gap: 20px;
    animation: ${fade_in} 0.6s ease-in-out;
    /*
    &::before{
        content: '${props => props.before_text ? props.before_text : null}';
        position: absolute;
        transform: translate(-120%, 0%);
        font-size: 16px;
        font-weight: bold;
    }
    */
    
`


const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    border: 2px solid black;
    width: 100px;
    height: 100%;
    border-radius: 100px;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
`

const MinusButton = styled.button`
    width: 50%;
    border-radius: 100px 0px 0px 100px;
    border: none;
    border-right: 3.5px solid #303030;
    outline: none;
    color: black;
    background-color: rgba(235, 87, 87, 0.8);
    
    &:hover{
        background-color: rgba(235, 87, 87, 0.7);
    }
    &:active{
        transform: scale(0.98);
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
    }
`

const PlusButton = styled.button`
    width: 50%;
    border-radius: 0px 100px 100px 0px;
    border: none;
    border-left: 3.5px solid #303030;
    outline: none;
    color: black;
    background-color: rgba(6, 214, 160, 0.8);

    &:hover{
        background-color: rgba(6, 214, 160, 0.7);
    }
    &:active{
        transform: scale(0.98);
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
    }
`

const PlusButtonO = styled.button`

`

export default function CounterButton({ counter, handleIncrement, handleDecrement }) {

    return (
        <MainContainer>
            <h4>{counter}</h4>
            <ButtonContainer>
                <MinusButton onClick={handleDecrement}><FontAwesomeIcon icon={faMinus} /></MinusButton>
                <PlusButton onClick={handleIncrement}><FontAwesomeIcon icon={faPlus} /></PlusButton>
            </ButtonContainer>
        </MainContainer>
    );

}

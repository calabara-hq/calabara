import styled from 'styled-components'
import { fade_in } from '../../common/common_styles'

export const RewardTypeWrap = styled.div`
    display: flex;
    flex-direction: column;
`
export const NumberWinnersContainer = styled.div`
    display: flex;
    align-items: center;
    width: 90%;
    margin: 0 auto;
`
export const RewardsMainContent = styled.div`
    background-color: #262626;
    margin: 20px 0;
    border-radius: 10px;
    border: 2px solid #4d4d4d;
    padding: 20px 0px;
    height: 100%;
    > * {
        margin-bottom: 20px;
    }
    animation: ${fade_in} 0.9s ease-in-out;

`

export const DeleteRewardButton = styled.button`
    background-color: transparent;
    border: none;
    border-radius: 10px;
    color: #4d4d4d;
    padding: 5px 10px;
    &:hover{
        background-color: rgba(244, 33, 46, 0.1);
        color: rgb(244, 33, 46);
    }

`

export const AddRewardButton = styled.button`
    width: fit-content;
    padding: 2px 20px;
    border-radius: 10px;
    border: none;
    background-color: #539bf5;
    color: black;
`
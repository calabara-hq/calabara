import styled from 'styled-components'
import { fade_in } from '../common/common_styles'

const RewardTypeWrap = styled.div`
    display: flex;
    flex-direction: column;
`
const NumberWinnersContainer = styled.div`
    display: flex;
    align-items: center;
    width: 90%;
    margin: 0 auto;
`
const RewardsMainContent = styled.div`
    background-color: #1c2128;
    margin-top: 20px;
    border-radius: 10px;
   // border: 2px solid #444c56;
    padding: 20px 0px;
    height: 100%;
    > * {
        margin-bottom: 20px;
    }
    animation: ${fade_in} 0.9s ease-in-out;

`


export {
    RewardTypeWrap,
    NumberWinnersContainer,
    RewardsMainContent
}
import styled from 'styled-components'
import { fade_in } from '../../../common/common_styles'

export const SubmitterRewardsGridLayout = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 2fr 2fr 2fr 1fr 1fr;
    grid-row-gap: 20px;
    text-align: center;
    position: relative;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 30px;
`


export const GridContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 5px;
    animation: ${fade_in} 0.3s ease-in-out;
    
`

export const RewardsGridInput = styled.input`
    border: 2px solid ${props => props.error ? 'red' : props.theme.palette.rewards_text_alt[props.name]};
    border-radius: 10px;
    background-color: #121212;
    outline: none;
    padding: 5px 10px;
    width: 80%;
    justify-self: center;
    align-self: center;
    text-align: center;

    &:focus, &:hover, &:active{
        border: 2px solid ${props => props.theme.palette.brand_alt};
    }
`

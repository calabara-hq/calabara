import styled from 'styled-components'
import { fade_in } from '../../../common/common_styles'

const SubmitterRewardsGridLayout = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-row-gap: 20px;
    text-align: center;
    position: relative;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 30px;
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
    width: 35%;
    justify-self: center;
    align-self: center;
    text-align: center;
    animation: ${fade_in} ${props => props.name * 0.7}s ease-in-out;

    &:focus, &:hover, &:active{
        border: 2px solid ${props => props.theme.palette.brand};
    }
`
export { SubmitterRewardsGridLayout, GridInputContainer, RewardsGridInput }
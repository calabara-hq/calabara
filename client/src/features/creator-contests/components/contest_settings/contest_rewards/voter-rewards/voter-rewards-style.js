import styled from 'styled-components';
import { fade_in } from '../../../common/common_styles';


const TopGridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: 1fr 1fr;
    grid-template-areas: "section_title ."
                         "voter_winners counter";
    align-items: center;
    grid-row-gap: 20px;
    justify-content: flex-start;
    text-align: left;
    width: 90%;
    margin: 0 auto;

`
const VotingRewardSelectorWrap = styled.div`
    display: grid;
    flex-direction: column;
    grid-gap: 20px;
    width: 90%;
    margin: 30px auto;
    animation: ${fade_in} 0.6s ease-in-out;

`
const RewardRowWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: ${fade_in} 0.6s ease-in-out;
`

const VoterRewardInput = styled.div`
    border: 2px solid #d95169;
    border-radius: 10px;
    background-color: #121212;
    outline: none;
    padding: 5px 10px;
    height: 40px;
    width: fit-content;
    justify-self: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
`

const VoterRankWrapper = styled.div`
    border: 2px solid #d95169;
    border-radius: 10px;
    background-color: #121212;
    outline: none;
    padding: 5px 10px;
    height: 40px;
    width: fit-content;
    justify-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`

const RewardsGridInput = styled.input`
    border: 2px solid ${props => props.error ? 'red' : props.theme.palette.rewards_text_alt[props.name]};
    border-radius: 10px;
    background-color: #121212;
    outline: none;
    padding: 5px 10px;
    width: 15%;
    justify-self: center;
    align-self: center;
    text-align: center;
    animation: ${fade_in} ${props => props.name * 0.7}s ease-in-out;

    &:focus, &:hover, &:active{
        border: 2px solid ${props => props.theme.palette.brand_alt};
    }
`




const RewardTypeButtons = styled.div`
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
`


const VoterRewardTypeButton = styled.button`
    border: none;
    background-color: ${props => props.selected ? '#539bf5' : '#2d333b'};
    color: ${props => props.selected ? 'black' : '#adbca7'};
    padding: 3px 7px;
    transition: background-color 0.2s ease-in-out;
    transition: color 0.2s ease-in-out;

`


const HeadingWithToggle = styled.div`
    display: flex;
    align-items: center;
`


export {
    TopGridWrapper,
    VotingRewardSelectorWrap,
    RewardRowWrapper,
    VoterRewardInput,
    VoterRankWrapper,
    RewardsGridInput,
    RewardTypeButtons,
    VoterRewardTypeButton,
    HeadingWithToggle
}
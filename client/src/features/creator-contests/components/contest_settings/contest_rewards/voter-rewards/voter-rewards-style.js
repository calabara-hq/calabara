import styled from 'styled-components';
import { fade_in } from '../../../common/common_styles';

const customSelectorStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'transparent',
        border: 'none',
        borderColor: 'transparent',
        boxShadow: 'none',
        color: 'white',
        cursor: 'pointer',
        justifyContent: 'center',
    }),

    indicatorContainer: (provided, state) => ({
        ...provided,
        padding: '0px'
    }),

    valueContainer: (provided, state) => ({
        ...provided,
        overflow: 'visible',
        fontSize: '14px',
        color: '#d3d3d3',
        padding: '3px 0px',
        minWidth: '6ch',
        padding: '2px',
        borderLeft: provided.selectType === 'reward' ? '1px solid white' : 'null'
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: '#d3d3d3',

    }),
    option: (provided, state) => ({
        ...provided,
        cursor: 'pointer',
        color: 'black'

    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        width: '10'

    }),
}



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
   // grid-template-columns: repeat(4, auto);
    grid-gap: 20px;
    align-items: center;
    text-align: center;
    animation: ${fade_in} 0.6s ease-in-out;
`

const VoterRewardInput = styled.div`
    border: 2px solid #80deea;
    border-radius: 100px;
    background-color: black;
    outline: none;
    padding: 5px 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
`

const VoterRankWrapper = styled.div`
    border: 2px solid #80deea;
    border-radius: 100px;
    background-color: black;
    outline: none;
    padding: 5px 10px;
    width: fit-content;
    justify-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`

const RewardsGridInput = styled.input`
    border: none;
    outline: none;
    background-color: transparent;
    padding: 5px 10px;
    justify-self: center;
    align-self: center;
`
const HeadingWithToggle = styled.div`
    display: flex;
    align-items: center;
   
`


export {
    customSelectorStyles,
    TopGridWrapper,
    VotingRewardSelectorWrap,
    RewardRowWrapper,
    VoterRewardInput,
    VoterRankWrapper,
    RewardsGridInput,
    HeadingWithToggle
}
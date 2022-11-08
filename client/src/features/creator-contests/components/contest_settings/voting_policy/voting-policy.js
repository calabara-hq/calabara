import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../../common/common_styles'
import { useEffect, useState } from 'react';
import AddPolicyModal from './add-policy-modal';
import '../../../../../css/status-messages.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faWallet } from '@fortawesome/free-solid-svg-icons';
import { rewardOptionState } from '../contest_rewards/reducers/rewards-reducer';
import { useSelector } from 'react-redux';
import { selectDashboardRules } from '../../../../gatekeeper/gatekeeper-rules-reducer';
import { useParams } from 'react-router-dom';
import useDashboardRules from '../../../../hooks/useDashboardRules';

const VotingPolicyWrap = styled.div`
    display: flex;
    flex-direction: column;
    &::before{
        content: '${props => props.title}';
        position: absolute;
        transform: translate(0%, -150%);
        color: #f2f2f2;
        font-size: 30px;
    }

    > * {
        margin-top: 10px;
        margin-bottom: 20px;
    }
`

const CreditStrategyWrap = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-width: 60%;
    margin: 0 auto;

`

export default function VotingPolicy({ votingStrategy, setVotingStrategy, votingStrategyError, setVotingStrategyError }) {
    const [addPolicyModalOpen, setAddPolicyModalOpen] = useState(false);
    const [selectedStrategy, setSelectedStratgey] = useState(null);
    const rewardOptions = useSelector(rewardOptionState.getRewardOptions)
    let availableRules = useSelector(selectDashboardRules)



    const handlePolicyModalOpen = (strategy_name) => {
        setSelectedStratgey(strategy_name)
        setAddPolicyModalOpen(true);
        setVotingStrategyError(false)
    }

    const handlePolicyModalClose = () => {
        setAddPolicyModalOpen(false);
    }


    const creditStrategies = [
        {
            strategy_name: 'Token',
            strategy_id: 0x1,
            strategy_description: 'Voting credits are based on erc-20 or erc-721 holdings. ',
            icon: faWallet
        },
        {
            strategy_name: 'Arcade',
            strategy_id: 0x2,
            strategy_description: 'Define a uniform number of credits allotted to each participant. ',
            icon: faTicket
        }
    ]

    return (
        <VotingPolicyWrap title="Voting Credit Strategy">
            <div style={{ width: 'fit-content' }} className='tab-message neutral'>
                <p>Voting credits determine how voting power is calculated, as well as any restrictions on voting power.</p>
            </div>
            {votingStrategyError && <div style={{ width: 'fit-content', margin: '0 auto' }} className='tab-message error'>
                <p>Please select a voting strategy</p>
            </div>}
            <CreditStrategyWrap>
                {creditStrategies.map((el, idx) => {
                    return <CreditStrategy key={idx} strategy={el} handlePolicyModalOpen={handlePolicyModalOpen} handlePolicyModalClose={handlePolicyModalClose} votingStrategy={votingStrategy} />
                })}
            </CreditStrategyWrap>
            {addPolicyModalOpen &&
                <AddPolicyModal
                    modalOpen={addPolicyModalOpen}
                    handleClose={handlePolicyModalClose}
                    selectedStrategy={selectedStrategy}
                    rewardOptions={rewardOptions}
                    availableRules={availableRules}
                    votingStrategy={votingStrategy}
                    setVotingStrategy={setVotingStrategy}
                />}
        </VotingPolicyWrap>
    )
}

const StrategyStyle = styled.div`
    display: flex;
    flex-direction: column;
    height: 300px;
    margin: 10px;
    padding: 5px 10px;
    background-color: #262626;
    border: 2px solid ${props => props.selected ? '#04AA6D' : '#4d4d4d'};
    border-radius: 4px;
    box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    flex: 1;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: visibility 0.2s, max-height 0.3s ease-in-out;


    &:hover{
        background-color: #1e1e1e;
        transform: scale(1.01);
        transition-duration: .5s;
    }
    &::after{
        font-family: 'Font Awesome 5 Free';
        margin-right: 10px;
        content: "\f00c";
        font-weight: 900;
        position: absolute;
        right: 0;
        top: 10px;
        color: #04AA6D;
        display: ${props => props.selected ? 'null' : 'none'}
    }
`

const StrategyName = styled.h4`
    font-size: 24px;
    font-weight: 550;
`
const StrategyDescription = styled.p`
    //margin: 0 auto;
    color: #b3b3b3;
    text-align: center;
    font-size: 14px;
    padding: 10px 10px;
`
const StrategyIcon = styled.span`
    font-size: 100px;
    color: ${props => props.name === 'Arcade' ? 'crimson' : '#fffdd0'};
`

function CreditStrategy({ strategy, handlePolicyModalOpen, votingStrategy }) {
    const handleLinkClick = (event, strategy_name) => {
        let link;
        if (strategy_name === 'Arcade') {
            link = 'https://docs.calabara.com/creator-contests/settings#arcade-style'
        }
        else { link = 'https://docs.calabara.com/creator-contests/settings#token-voting' }
        window.open(link)
        event.stopPropagation();

    }
    return (
        <StrategyStyle onClick={() => handlePolicyModalOpen(strategy.strategy_id)} selected={votingStrategy.strategy_id === strategy.strategy_id}>
            <StrategyName>{strategy.strategy_name}</StrategyName>
            <StrategyDescription>{strategy.strategy_description}<u onClick={(event) => handleLinkClick(event, strategy.strategy_name)}> Learn More</u></StrategyDescription>
            <StrategyIcon name={strategy.strategy_name}><FontAwesomeIcon icon={strategy.icon} /></StrategyIcon>
        </StrategyStyle>
    )
}
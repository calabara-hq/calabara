import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../../common/common_styles'
import { useState } from 'react';
import AddPolicyModal from './add-policy-modal';
import '../../../../../css/status-messages.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faWallet } from '@fortawesome/free-solid-svg-icons';


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

export default function VotingPolicy({ rewardOptions, votingStrategy, setVotingStrategy }) {
    const [addPolicyModalOpen, setAddPolicyModalOpen] = useState(false);
    const [selectedStrategy, setSelectedStratgey] = useState(null);
    const handlePolicyModalOpen = (strategy_name) => {
        setSelectedStratgey(strategy_name)
        setAddPolicyModalOpen(true);
    }

    const handlePolicyModalClose = () => {
        setAddPolicyModalOpen(false);

    }

    let availableRules = {
        "55": {
            "guildId": "892877917762244680",
            "serverName": "Calabara",
            "type": "discord",
            "available_roles": [
                {
                    "role_id": "892877917762244680",
                    "role_name": "@everyone",
                    "role_color": 0
                },
                {
                    "role_id": "893184621523660850",
                    "role_name": "core-team",
                    "role_color": 15105570
                },
                {
                    "role_id": "895903844926623785",
                    "role_name": "bot",
                    "role_color": 6323595
                },
                {
                    "role_id": "896082699402510377",
                    "role_name": "member",
                    "role_color": 15277667
                },
                {
                    "role_id": "896088160684089447",
                    "role_name": "MEE6",
                    "role_color": 0
                },
                {
                    "role_id": "899761111476359269",
                    "role_name": "szn1",
                    "role_color": 1752220
                },
                {
                    "role_id": "907775296659390496",
                    "role_name": "OG calabarator",
                    "role_color": 15844367
                },
                {
                    "role_id": "908035108861251605",
                    "role_name": "sesh",
                    "role_color": 0
                },
                {
                    "role_id": "919991694030671893",
                    "role_name": "carl-bot",
                    "role_color": 0
                },
                {
                    "role_id": "919994529912881192",
                    "role_name": "onboardee",
                    "role_color": 10181046
                },
                {
                    "role_id": "956696519384391703",
                    "role_name": "calabara",
                    "role_color": 11342935
                },
                {
                    "role_id": "974402409533149217",
                    "role_name": "Member",
                    "role_color": 0
                }
            ]
        },
        "64": {
            "type": "erc20",
            "symbol": "SHARK",
            "address": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
            "decimal": "18"
        },
        "72": {
            "type": "erc721",
            "symbol": "NOUN",
            "address": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
            "decimal": "0"
        },
        "73": {
            "type": "erc721",
            "symbol": "MFER",
            "address": "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
            "decimal": "0"
        }
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
            <CreditStrategyWrap>
                {creditStrategies.map(el => {
                    return <CreditStrategy strategy={el} handlePolicyModalOpen={handlePolicyModalOpen} handlePolicyModalClose={handlePolicyModalClose} votingStrategy={votingStrategy}/>
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
            link = 'xyz'
        }
        else { link = 'zzz' }
        alert(link)
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
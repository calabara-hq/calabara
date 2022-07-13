import React, { useEffect, useState } from 'react'
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import ethLogo from '../../../../img/eth.png'

const Wrap = styled.div`
    display: grid;
    grid-template-rows: 2;
    grid-area: rewards;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 30px;
    border-bottom: 1px solid grey;
`
const AvailableRewards = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    width: 80%;
    padding-top: 20px;
`

const RewardOptionEditBtn = styled.button`
    position: absolute;
    right: 0;
    border: none;
    border-radius: 4px;
    color: black;
`

const ContractAdressInputContainer = styled.div`

    display: flex;
    flex-direction: column;
    margin-top: 2em;

    &::before{
        content: "Contract Address";
        position: absolute;
        transform: translate(0%, -100%);
        
    }
`


const ContractAddressInput = styled.input`
    margin-top: 1em;
`

const RewardOptionEditCancelDelete = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    border-radius: 4px;
    color: black;
`


export default function RewardSelector({ rewardOptions, setRewardOptions }) {
    // need to raise this higher in the tree later on. just for testing now

    const existingRules = Object.values({
        '61': {
            gatekeeperType: 'ETH',
            gatekeeperSymbol: 'ETH',
            gatekeeperImg: 'eth'
        },
        '62': {
            gatekeeperType: 'erc721',
            gatekeeperSymbol: 'NOUN',
            gatekeeperAddress: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03'
        },
        '63': {
            gatekeeperType: 'erc20',
            gatekeeperSymbol: 'SHARK',
            gatekeeperAddress: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            gatekeeperDecimal: '18'
        }
    });

    const [editIndex, setEditIndex] = useState(-1)

    const handleEditRewardOption = (index) => {
        setEditIndex(index)
    }

    return (
        <Wrap>
            <h3>Select Rewards</h3>
            <AvailableRewards>
                {existingRules.map((el, idx) => {
                    return (
                        <>
                            <div className="gatekeeper-option" style={{ position: 'relative' }} key={idx}>
                                {editIndex != idx &&
                                    <>
                                        {el.gatekeeperSymbol != 'ETH' && <RewardOptionEditBtn onClick={() => handleEditRewardOption(idx)}><FontAwesomeIcon icon={faPencil}></FontAwesomeIcon></RewardOptionEditBtn>}
                                        <p><b>Type:</b> <span className={el.gatekeeperType}>{el.gatekeeperType}</span></p>
                                        {el.gatekeeperSymbol != 'ETH' && <p><b>Symbol:</b> {el.gatekeeperSymbol}</p>}
                                        {el.gatekeeperAddress && <button onClick={() => { window.open('https://etherscan.io/address/' + el.gatekeeperAddress) }} className="gatekeeper-config">{el.gatekeeperAddress.substring(0, 6)}...{el.gatekeeperAddress.substring(38, 42)} <i className="fas fa-external-link-alt"></i></button>}
                                        {el.gatekeeperImg && <img style={{ margin: '0 auto' }} src={ethLogo}></img>}
                                        <ToggleSwitch id={idx} value={el} rewardOptions={rewardOptions} setRewardOptions={setRewardOptions} existingRules={existingRules} />
                                    </>
                                }
                                {editIndex === idx &&
                                    <ContractAdressInputContainer>
                                        <RewardOptionEditCancelDelete>
                                        <button>cancel</button>
                                        <button>delete</button>
                                        </RewardOptionEditCancelDelete>
                                        <ContractAddressInput placeholder="0x1234..."></ContractAddressInput>
                                        <p><b>Symbol:</b> {el.gatekeeperSymbol}</p>
                                        {el.gatekeeperType !== 'erc721' && <p><b>decimal:</b> {el.gatekeeperDecimal}</p>}
                                    </ContractAdressInputContainer>
                                }

                            </div>
                        </>
                    )
                })}

            </AvailableRewards>
        </Wrap>
    )
}

function ToggleSwitch({ id, value, rewardOptions, setRewardOptions, existingRules }) {

    const [isRuleChecked, setIsRuleChecked] = useState(false)

    const handleToggle = () => {

        if (!isRuleChecked) {
            setIsRuleChecked(true)
            setRewardOptions({ type: 'update_single', payload: { [value.gatekeeperType]: value.gatekeeperSymbol } })
        }
        else {
            setIsRuleChecked(false)
            let options_copy = { ...rewardOptions }
            delete options_copy[value.gatekeeperType];
            setRewardOptions({ type: 'update_all', payload: options_copy })
        }
    }




    return (
        <div className="gatekeeper-toggle">
            <input checked={isRuleChecked} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle${id}`} type="checkbox" />
            <label style={{ background: isRuleChecked && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle${id}`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}

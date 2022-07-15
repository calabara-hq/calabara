import React, { useEffect, useState, useReducer } from 'react'
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import ethLogo from '../../../../img/eth.png'
import EditRewardsModal from './contest-reward-input-modal';
import { TagType } from '../common/common_styles';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    grid-area: rewards;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 30px;
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

const NewRewardContainer = styled.div`
    margin-top: 2em;
`
const NewERC20Reward = styled.button`
    color: black;
`

const NewERC721Reward = styled.button`
    color: black;
`

const RewardOption = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    grid-gap: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    border: none;
    border-radius: 4px;
    background-color: #1c2128;
    padding: 5px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);

    & > p{
        color: lightgrey;
        margin: 0;
    }

    & > p > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }

`



export default function RewardSelector({ rewardOptions, setRewardOptions, selectedRewards, setSelectedRewards }) {
    // need to raise this higher in the tree later on. just for testing now


    const [editType, setEditType] = useState(null);
    const [editRewardsModalOpen, setEditRewardsModalOpen] = useState(false);

    useEffect(() => { console.log(rewardOptions) }, [rewardOptions])

    const handleEditRewardOption = (type) => {
        setEditType(type)
        setEditRewardsModalOpen(true)

    }




    const handleRewardsModalClose = (mode, payload) => {
        if (mode === 'delete') {
            let options_copy = JSON.parse(JSON.stringify(rewardOptions))
            let selected_copy = JSON.parse(JSON.stringify(selectedRewards))
            
            delete options_copy[payload.type];
            delete selected_copy[payload.type];
            setRewardOptions({type: 'update_all', payload: options_copy})
            setSelectedRewards({type: 'update_all', payload: selected_copy})

        }
        else if (mode === 'save') {
            setRewardOptions({ type: 'update_single', payload: { [payload.type]: { type: payload.type, symbol: payload.symbol, address: payload.address } } })
            if(selectedRewards[payload.type]) setSelectedRewards({ type: 'update_single', payload: { [payload.type]: payload.symbol } })
        }
        setEditRewardsModalOpen(false)

    }


    return (
        <Wrap>
            <h3>Select Rewards</h3>
            <AvailableRewards>
                {Object.values(rewardOptions).map((el, idx) => {
                    console.log(el)
                    return (
                        <>

                            <RewardOption key={idx}>
                                <>
                                    {el.type != 'ETH' && <RewardOptionEditBtn onClick={() => handleEditRewardOption(el.type)}><FontAwesomeIcon icon={faPencil}></FontAwesomeIcon></RewardOptionEditBtn>}
                                    <p><b>Type:</b> <TagType type={el.type}>{el.type}</TagType></p>
                                    {el.symbol != 'ETH' && <p><b>Symbol:</b> {el.symbol}</p>}
                                    {el.address && <button onClick={() => { window.open('https://etherscan.io/address/' + el.address) }} className="gatekeeper-config">{el.address.substring(0, 6)}...{el.address.substring(38, 42)} <i className="fas fa-external-link-alt"></i></button>}
                                    {el.img && <img style={{ margin: '0 auto' }} src={ethLogo}></img>}
                                    <ToggleSwitch id={idx} value={el} selectedRewards={selectedRewards} setSelectedRewards={setSelectedRewards} />
                                </>
                            </RewardOption>

                        </>
                    )
                })}
            </AvailableRewards>
            <NewRewardContainer>
                {!rewardOptions.erc20 && <NewERC20Reward onClick={() => handleEditRewardOption('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</NewERC20Reward>}
                {!rewardOptions.erc721 && <NewERC721Reward onClick={() => handleEditRewardOption('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</NewERC721Reward>}
            </NewRewardContainer>
            <EditRewardsModal modalOpen={editRewardsModalOpen} handleClose={handleRewardsModalClose} existingRewardData={rewardOptions[editType]} type={editType} />
        </Wrap>
    )
}

function ToggleSwitch({ id, value, selectedRewards, setSelectedRewards }) {

    const [isRuleChecked, setIsRuleChecked] = useState(false)

    const handleToggle = () => {

        if (!isRuleChecked) {
            setIsRuleChecked(true)
            setSelectedRewards({ type: 'update_single', payload: { [value.type]: value.symbol } })
        }
        else {
            setIsRuleChecked(false)
            let options_copy = { ...selectedRewards }
            delete options_copy[value.type];
            setSelectedRewards({ type: 'update_all', payload: options_copy })
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

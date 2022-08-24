import React, { useEffect, useState, useReducer } from 'react'
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import ethLogo from '../../../../../img/eth.png'
import EditRewardsModal from './contest-reward-input-modal';
import { Contest_h3_alt, ERC20Button_alt, TagType } from '../../common/common_styles';
import { ERC20Button, ERC721Button_alt } from '../../common/common_styles';
const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    grid-area: rewards;
    width: 90%;
    margin: 20px auto;
    padding-bottom: 30px;
`
const AvailableRewards = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-top: 20px;
`

const RewardOptionEditBtn = styled.button`
    position: absolute;
    right: 0;
    border: none;
    border-radius: 4px;
    color: grey;
    background-color: transparent;
    &:hover{
        background-color: #768390;
        color: #d3d3d3;
    }
`

const NewRewardContainer = styled.div`
    margin-top: 2em;
    margin-left: 10px;
    display: flex;
    > * {
        flex: 0 1 15%;
    }
`


const RewardOption = styled.div`
    position: relative;
    flex: 1 1 0;
    max-width: 33%;
    display: flex;
    margin: 10px;
    flex-direction: column;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    grid-gap: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    background-color: #262626;
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

    & > ${RewardOptionEditBtn}{
        display: none;

    }
    &:hover{
        > ${RewardOptionEditBtn} {
            display: block;
            }
        }

`

const EtherScanLinkButton = styled.button`
   cursor: pointer;
   padding: 3px 3px;
   border-radius: 5px;
   background-color: transparent;
   border: none;
   color: grey;
   text-align: left;
  &:hover{
    background-color: #768390;
    color: #d3d3d3;
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
            setRewardOptions({ type: 'update_all', payload: options_copy })
            setSelectedRewards({ type: 'update_all', payload: selected_copy })

        }
        else if (mode === 'save') {
            console.log(payload)
            setRewardOptions({ type: 'update_single', payload: { [payload.type]: { type: payload.type, symbol: payload.symbol, address: payload.address } } })
            if (selectedRewards[payload.type]) setSelectedRewards({ type: 'update_single', payload: { [payload.type]: payload.symbol } })
        }
        setEditRewardsModalOpen(false)

    }


    return (
        <Wrap>
            <Contest_h3_alt>Select Rewards</Contest_h3_alt>
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
                                    {el.address && <EtherScanLinkButton onClick={() => { window.open('https://etherscan.io/address/' + el.address) }} className="gatekeeper-config">{el.address.substring(0, 6)}...{el.address.substring(38, 42)} <i className="fas fa-external-link-alt"></i></EtherScanLinkButton>}
                                    {el.img && <img style={{ margin: '0 auto' }} src={ethLogo}></img>}
                                    <ToggleSwitch id={idx} value={el} selectedRewards={selectedRewards} setSelectedRewards={setSelectedRewards} />
                                </>
                            </RewardOption>

                        </>
                    )
                })}
            </AvailableRewards>
            <NewRewardContainer>
                {!rewardOptions.erc20 && <ERC20Button_alt onClick={() => handleEditRewardOption('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</ERC20Button_alt>}
                {!rewardOptions.erc721 && <ERC721Button_alt onClick={() => handleEditRewardOption('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</ERC721Button_alt>}
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

import React, { useEffect, useState, useReducer, useContext } from 'react'
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import ethLogo from '../../../../../img/eth.png'
import EditRewardsModal from './contest-reward-input-modal';
import { Contest_h3_alt, ERC20Button_alt, TagType } from '../../common/common_styles';
import { ERC20Button, ERC721Button_alt } from '../../common/common_styles';
import { rewardOptionsActions, rewardOptionsState } from './reducers/reward-options-reducer';
import { useDispatch, useSelector } from 'react-redux';


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

export default function RewardSelector({ }) {
    // need to raise this higher in the tree later on. just for testing now
    const [tokenType, setTokenType] = useState(null);
    const [editRewardsModalOpen, setEditRewardsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const rewardOptions = useSelector(rewardOptionsState.getRewardOptions)
    //const selectedRewards = useSelector(rewardOptionsState.getSelectedRewards)


    const handleEditRewardOption = (tokenType) => {
        setTokenType(tokenType)
        setEditRewardsModalOpen(true)

    }



    useEffect(() => {
        console.log(rewardOptions)
    }, [rewardOptions])

    const handleRewardsModalClose = (payload) => {
        dispatch(rewardOptionsActions.addReward({ type: payload.type, symbol: payload.symbol, address: payload.address, selected: false}))
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
                                    <ToggleSwitch id={idx} value={el} />
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
            <EditRewardsModal modalOpen={editRewardsModalOpen} handleClose={handleRewardsModalClose} existingRewardData={rewardOptions[tokenType]} tokenType={tokenType} />
        </Wrap>
    )
}

function ToggleSwitch({ id, value }) {
    const [isRewardSelected, setIsRewardSelected] = useState(false)
    const dispatch = useDispatch();
    const handleToggle = () => {

        if (!isRewardSelected) {
            setIsRewardSelected(true)
            dispatch(rewardOptionsActions.setRewardSelected({ type: value.type}))
        }
        else {
            setIsRewardSelected(false)
            //let options_copy = { ...selectedRewards }
            //delete options_copy[value.type];
            //setSelectedRewards({ type: 'update_all', payload: options_copy })
        }

    }




    return (
        <div className="gatekeeper-toggle">
            <input checked={isRewardSelected} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle${id}`} type="checkbox" />
            <label style={{ background: isRewardSelected && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle${id}`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}

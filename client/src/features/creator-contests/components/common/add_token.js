import React, { useState, useEffect } from 'react';
import useContract from '../../../hooks/useContract';
import styled from 'styled-components'
import { TagType } from './common_styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ContractAdressInputContainer = styled.div`

    display: flex;
    flex-direction: column;
    margin-top: 2em;
    margin-bottom: 2em;

    &::before{
        content: "Contract Address";
        position: absolute;
        font-weight: bold;
        transform: translate(0%, -100%);
    }
`

const ContractAddressInput = styled.input`
    margin-top: 1em;
    color: black;
`

const RewardType = styled.p`
    color: lightgrey;
    margin: 0;

    & > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`
const CreateRewardWrap = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 20px;
    }
`
const RewardOptionSaveBtn = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
    color: black;
`

const BackButton = styled.button`
    position: absolute;
    bottom: 0;
    left: 0;
    color: black;
`

export default function AddNewToken({ existingRewardData, type, showBackButton, handleBackButton, handleNextButton }) {
    const [newContractAddress, setNewContractAddress] = useState(existingRewardData ? existingRewardData.address : null);
    const [newSymbol, setNewSymbol] = useState(null);
    const [newDecimal, setNewDecimal] = useState(null);
    const [addressError, setAddressError] = useState(false);
    const { tokenGetSymbolAndDecimal } = useContract();



    const fetchContractData = async (e) => {
            try {
                let [symbol, decimal] = await tokenGetSymbolAndDecimal(e.target.value);
                setNewSymbol(symbol)
                setNewDecimal(decimal)
            } catch (e) {
                setAddressError(true)
            }
    }

    const handleRewardAdressChange = async (e) => {
        if (addressError) setAddressError(false)
        setNewContractAddress(e.target.value)
        if (e.target.value.length === 42) await fetchContractData(e)
        else {
            setNewSymbol(null)
            setNewDecimal(null)
        }
    }

    const handleConfirm = () => {
        // error check then proceed with next button
        handleNextButton({type: type, address: newContractAddress, symbol: newSymbol, decimal: newDecimal});
    }

    return (
        <CreateRewardWrap>
            <RewardType><b>Type:</b> <TagType type={type}>{type}</TagType></RewardType>
            <ContractAdressInputContainer>
                <ContractAddressInput placeholder="0x1234..." value={newContractAddress} onChange={handleRewardAdressChange}></ContractAddressInput>
            </ContractAdressInputContainer>
            {newSymbol && <p><b>Symbol:</b> {newSymbol}</p>}
            {type !== 'erc721' && newDecimal && <p><b>decimal:</b> {newDecimal}</p>}
            {addressError && <p>could not find address</p>}
            {showBackButton && <BackButton onClick={handleBackButton}><FontAwesomeIcon icon={faArrowLeft}/></BackButton>}
            <RewardOptionSaveBtn disabled={!newSymbol} onClick={handleConfirm}>confirm</RewardOptionSaveBtn>
        </CreateRewardWrap>
    )
}
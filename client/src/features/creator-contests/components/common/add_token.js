import React, { useState, useEffect } from 'react';
import useContract from '../../../hooks/useContract';
import styled from 'styled-components'
import { ConfirmButton, ErrorMessage, TagType } from './common_styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const Row = styled.div`
`
const ContractAddressInput = styled.input`
    color: #d3d3d3;
    border: 2px solid rgba(128,222,234,1);
    border-radius: 10px;
    padding: 10px 15px;
    outline: none;
    background-color: #2d2e35;
    width: 80%;

    
`

const SymbolDecimalInput = styled.div`
    color: darkgrey;
    border: 2px solid darkgrey;
    width: 20%;
    height: 44px;
    border-radius: 10px;
    padding: 10px 15px;
    outline: none;
    background-color: #2d2e35;
    cursor: not-allowed;
    & > p{
        margin: 0;
    }
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
    padding: 20px 0px;
    position: relative;

    > ${Row} {
        margin-bottom: 20px;
    }


`

const BackButton = styled.button`
    position: absolute;
    bottom: 0;
    left: 0;
    color: darkgrey;
    background-color: transparent;
    border: 2px solid darkgrey;
    border-radius: 4px;
    padding: 5px 20px;

    &:hover{
        background-color: darkgrey;
        color: black;
    }
`


export default function AddNewToken({ existingRewardData, type, showBackButton, handleBackButton, handleNextButton, checkDuplicates, existingRules }) {
    const [newContractAddress, setNewContractAddress] = useState(existingRewardData ? existingRewardData.address : null);
    const [newSymbol, setNewSymbol] = useState(null);
    const [newDecimal, setNewDecimal] = useState(null);
    const [addressError, setAddressError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [duplicateAddressError, setDuplicateAddressError] = useState(false);
    const { tokenGetSymbolAndDecimal, isERC721 } = useContract();

    useEffect(() => {
        if (newContractAddress) return fetchContractData(newContractAddress)
    }, [])


    const clearErrors = () => {
        setAddressError(false);
        setTypeError(false);
        setDuplicateAddressError(false);
    }

    const checkForDuplicates = (address) => {
        for (var i in existingRules) {
            console.log(existingRules[i].gatekeeperAddress === address)
            if ((existingRules[i].gatekeeperAddress == address) && (existingRules[i].gatekeeperType != 'discord')) {
                return true
            }
        }
        return false
    }

    const fetchContractData = async (address) => {
        // throw error if:
        // user entered an erc721 but tried to add an erc20
        // user entered an erc20 but tried to add an erc721
        if (checkDuplicates) {
            let isDuplicate = checkForDuplicates(address);
            if(isDuplicate) return setDuplicateAddressError(true)
        }
        
        let isTokenERC721 = await isERC721(address);
        if ((isTokenERC721 && type === 'erc20') || (!isTokenERC721 && type === 'erc721')) return setTypeError(true)
        try {
            let [symbol, decimal] = await tokenGetSymbolAndDecimal(address);
            setNewSymbol(symbol)
            setNewDecimal(decimal)
        } catch (e) {
            setAddressError(true)
        }
    }

    const handleRewardAdressChange = (address) => {
        if (addressError || typeError || duplicateAddressError) clearErrors();
        setNewContractAddress(address)
        if (address.length === 42) return fetchContractData(address)
        else {
            setNewSymbol(null)
            setNewDecimal(null)
        }
    }

    const handleConfirm = () => {
        // error check then proceed with next button
        handleNextButton({ type: type, address: newContractAddress, symbol: newSymbol, decimal: newDecimal });
    }

    return (
        <CreateRewardWrap>
            <Row>
                <RewardType><b>Type:</b> <TagType type={type}>{type}</TagType></RewardType>
            </Row>
            <Row>
                <p><b>Contract Address</b></p>
                <ContractAddressInput placeholder="0x1234..." value={newContractAddress} onChange={(e) => handleRewardAdressChange(e.target.value)}></ContractAddressInput>
                {addressError && <ErrorMessage style={{ maxWidth: '80%' }}><p>could not find address</p></ErrorMessage>}
                {typeError && <ErrorMessage style={{ maxWidth: '80%' }}><p>this doesn't look like an {type} token</p></ErrorMessage>}
                {duplicateAddressError && <ErrorMessage style={{ maxWidth: '80%' }}><p>it looks like you already added this token</p></ErrorMessage>}

            </Row>
            <Row>
                <p><b>Symbol</b></p>
                <SymbolDecimalInput >
                    <p>{newSymbol}</p>
                </SymbolDecimalInput>
            </Row>
            <Row style={{marginBottom: '40px'}}>
                <p><b>Decimal</b></p>
                <SymbolDecimalInput>
                    <p>{newDecimal}</p>
                </SymbolDecimalInput>
            </Row>

            {showBackButton && <BackButton onClick={handleBackButton}><FontAwesomeIcon icon={faArrowLeft} /></BackButton>}
            <ConfirmButton disabled={!newSymbol} onClick={handleConfirm}>confirm</ConfirmButton>
        </CreateRewardWrap>
    )
}
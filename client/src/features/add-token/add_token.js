import React, { useState, useEffect } from 'react';
import useContract from '../hooks/useContract';
import styled from 'styled-components'
import { ConfirmButton, ConfirmButtonAlt, ErrorMessage, TagType } from '../creator-contests/components/common/common_styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const Row = styled.div`
`
const ContractAddressInput = styled.input`
    width: 80%;
    color: #d3d3d3;
    background-color: #121212;
    border: 2px solid rgb(83, 155, 245);
    border-radius: 10px;
    outline: none;
    padding: 10px 15px;

    
`

const EditableInput = styled.input`
    min-width: 20%;
    width: fit-content;
    color: #d3d3d3;
    background-color: #121212;
    border: 2px solid rgb(83, 155, 245);
    border-radius: 10px;
    outline: none;
    padding: 10px 15px;
`



const SymbolDecimalInput = styled.div`
    color: darkgrey;
    border: 2px solid #4d4d4d;
    min-width: 20%;
    width: fit-content;
    height: 44px;
    border-radius: 10px;
    padding: 10px 15px;
    outline: none;
    background-color: #262626;
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
    const [newTokenId, setNewTokenId] = useState(null);
    const [addressError, setAddressError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [duplicateAddressError, setDuplicateAddressError] = useState(false);
    const [tokenIdError, setTokenIdError] = useState(false);
    const [tokenSymbolError, setTokenSymbolError] = useState(false);
    const { tokenGetSymbolAndDecimal, getTokenStandard, isValidERC1155TokenId } = useContract();

    useEffect(() => {
        if (newContractAddress) return fetchContractData(newContractAddress)
    }, [])


    const clearErrors = () => {
        setAddressError(false);
        setTypeError(false);
        setTokenIdError(false);
        setDuplicateAddressError(false);
    }

    const checkForDuplicates = () => {
        for (var i in existingRules) {
            if (type !== 'erc1155') {
                if ((existingRules[i].address == newContractAddress) && (existingRules[i].type != 'discord')) {
                    return true
                }
            }
            if (type === 'erc1155') {
                if ((existingRules[i].address == newContractAddress) && (existingRules[i].token_id === newTokenId)) {
                    return true
                }
            }
        }
        return false
    }

    const fetchContractData = async (address) => {
        let tokenStandard = await getTokenStandard(address);
        if (tokenStandard !== type) return setTypeError(true);
        try {
            let [symbol, decimal] = await tokenGetSymbolAndDecimal(address, tokenStandard);
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

    const handleTokenIdChange = (id) => {
        setTokenIdError(false);
        setNewTokenId(id)
    }

    const handleTokenSymbolChange = (val) => {
        setTokenSymbolError(false);
        setNewSymbol(val)
    }

    const handleConfirm = async () => {
        let token_data = { type: type, address: newContractAddress, symbol: newSymbol, decimal: newDecimal }
        if (type === 'erc1155') {
            //check for valid tokenid
            const isValidTokenId = await isValidERC1155TokenId(newContractAddress, newTokenId)
            if (!isValidTokenId) return setTokenIdError(true)
            if (newSymbol === '') return setTokenSymbolError(true);
            token_data.token_id = newTokenId
        }
        if (checkDuplicates) {
            let isDuplicate = checkForDuplicates();
            if (isDuplicate) return setDuplicateAddressError(true)
        }
        handleNextButton(token_data);
    }


    if (type === 'erc1155') {
        return (
            <CreateRewardWrap>
                <Row>
                    <RewardType><b>Type:</b> <TagType type={type}>{type}</TagType></RewardType>
                </Row>
                <Row>
                    <p><b>Contract Address</b></p>
                    <ContractAddressInput placeholder="0x1234..." value={newContractAddress} onChange={(e) => handleRewardAdressChange(e.target.value)} />
                    {addressError && <ErrorMessage style={{ maxWidth: '80%' }}><p>could not find address</p></ErrorMessage>}
                    {typeError && <ErrorMessage style={{ maxWidth: '80%' }}><p>this doesn't look like an {type} token</p></ErrorMessage>}
                    {duplicateAddressError && <ErrorMessage style={{ maxWidth: '80%' }}><p>it looks like you already added this token</p></ErrorMessage>}

                </Row>
                <Row>
                    <p><b>Token ID</b></p>
                    <EditableInput onWheel={(e) => e.target.blur()} placeholder="3" type={"number"} value={newTokenId} onChange={(e) => handleTokenIdChange(e.target.value)} />
                    {tokenIdError && <ErrorMessage style={{ maxWidth: '80%' }}><p>this doesn't look like a valid token id</p></ErrorMessage>}
                </Row>
                <Row>
                    <p><b>Symbol</b></p>
                    <EditableInput onWheel={(e) => e.target.blur()} maxLength={"15"} value={newSymbol} onChange={(e) => handleTokenSymbolChange(e.target.value)} />
                    {tokenSymbolError && <ErrorMessage style={{ maxWidth: '80%' }}><p>please define a token symbol</p></ErrorMessage>}

                </Row>
                <Row style={{ marginBottom: '40px' }}>
                    <p><b>Decimal</b></p>
                    <SymbolDecimalInput>
                        <p>{newDecimal}</p>
                    </SymbolDecimalInput>
                </Row>

                {showBackButton && <BackButton onClick={handleBackButton}><FontAwesomeIcon icon={faArrowLeft} /></BackButton>}
                <ConfirmButtonAlt disabled={!newSymbol || !newTokenId} onClick={handleConfirm}>confirm</ConfirmButtonAlt>
            </CreateRewardWrap>
        )
    }

    return (
        <CreateRewardWrap>
            <Row>
                <RewardType><b>Type:</b> <TagType type={type}>{type}</TagType></RewardType>
            </Row>
            <Row>
                <p><b>Contract Address</b></p>
                <ContractAddressInput placeholder="0x1234..." value={newContractAddress} onChange={(e) => handleRewardAdressChange(e.target.value)} />
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
            <Row style={{ marginBottom: '40px' }}>
                <p><b>Decimal</b></p>
                <SymbolDecimalInput>
                    <p>{newDecimal}</p>
                </SymbolDecimalInput>
            </Row>

            {showBackButton && <BackButton onClick={handleBackButton}><FontAwesomeIcon icon={faArrowLeft} /></BackButton>}
            <ConfirmButtonAlt disabled={!newSymbol} onClick={handleConfirm}>confirm</ConfirmButtonAlt>
        </CreateRewardWrap>
    )
}
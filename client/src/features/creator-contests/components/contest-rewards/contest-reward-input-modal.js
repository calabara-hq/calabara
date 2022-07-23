import React, { useState, useEffect, useReducer, useRef } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../../../css/status-messages.css';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ContestSubmissionCheckpointBar } from '../../../checkpoint-bar/checkpoint-bar';
import useContract from '../../../hooks/useContract';
import { TagType } from '../common/common_styles';
import AddNewToken from '../common/add_token';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    bgcolor: '#1d1d1d',
    border: '2px solid rgba(29, 29, 29, 0.3)',
    boxShadow: 20,
    p: 4,
    borderRadius: '20px',
    height: 'auto',
    minHeight: '40vh',
    width: '50vw',
    // maxWidth: '1130px',
    minWidth: '350px'
};

const ModalWrapper = styled.div`
    color: #d3d3d3;
    display: flex;
    flex-direction: column;
    gap: 50px;
`
const CreateRewardWrap = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 10px;
    }
`

const NextButton = styled.button`
    position: absolute;
    right: 30px;
    bottom: 10px;
    color: white;
    background-color: #00a368;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
`
const PreviousButton = styled.button`
    position: absolute;
    left: 30px;
    bottom: 10px;
    color: white;
    background-color: #2d2e35;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
`

const ExitButton = styled.button`
    position: absolute;
    right: 30px;
    top: 10px;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-weight: bold;
    background-color: #2d2e35;
    color: lightcoral;
    
`

const ModalHeading = styled.p`
    font-size: 26px;
    width: 'fit-content';
`

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

const RewardOptionEditCancelDelete = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    border-radius: 4px;
    color: black;
`
const RewardOptionSaveBtn = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
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

export default function EditRewardsModal({ modalOpen, handleClose, existingRewardData, type }) {

    const handleSave = (data) => {
        console.log(data)
        handleClose('save', data)
    }
    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={() => { handleClose({ type: 'standard' }) }}
            >
                <Box sx={style}>
                    <ModalWrapper>
                        <div>
                            <ModalHeading>Create Reward Option</ModalHeading>
                            <ExitButton onClick={() => { handleClose({ type: 'standard' }) }}>exit</ExitButton>
                        </div>
                        <AddNewToken existingRewardData={existingRewardData} type={type} showBackButton={false} handleNextButton={handleSave} />
                    </ModalWrapper>

                </Box>
            </Modal>
        </div>
    );
}

/*
function EditRewards({ existingRewardData, handleClose, type }) {

    const [newContractAddress, setNewContractAddress] = useState(existingRewardData ? existingRewardData.address : null);
    const [newSymbol, setNewSymbol] = useState(null);
    const [newDecimal, setNewDecimal] = useState(null);
    const [addressError, setAddressError] = useState(false);
    const { erc20GetSymbolAndDecimal, erc721GetSymbol } = useContract();



    const fetchContractData = async (e) => {
        if (type === 'erc20') {
            try {
                let [symbol, decimal] = await erc20GetSymbolAndDecimal(e.target.value);
                setNewSymbol(symbol)
                setNewDecimal(decimal)
            } catch (e) {
                setAddressError(true)
            }

        }
        else if (type === 'erc721') {
            try {
                let symbol = await erc721GetSymbol(e.target.value);
                setNewSymbol(symbol)
            } catch (e) {
                setAddressError(true)
            }

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


    



    return (
        <CreateRewardWrap>
            <RewardOptionEditCancelDelete>
                <button onClick={() => handleClose('delete', {type: type})}>delete</button>
            </RewardOptionEditCancelDelete>
            <RewardType><b>Type:</b> <TagType type={type}>{type}</TagType></RewardType>
            <ContractAdressInputContainer>
                <ContractAddressInput placeholder="0x1234..." value={newContractAddress} onChange={handleRewardAdressChange}></ContractAddressInput>
            </ContractAdressInputContainer>
            {newSymbol && <p><b>Symbol:</b> {newSymbol}</p>}
            {type !== 'erc721' && newDecimal && <p><b>decimal:</b> {newDecimal}</p>}
            {addressError && <p>could not find address</p>}
            <RewardOptionSaveBtn disabled={!newSymbol} onClick={handleSave}>save</RewardOptionSaveBtn>
        </CreateRewardWrap>
    )
}
*/
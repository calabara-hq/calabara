import React, { useState, useEffect, useReducer, useRef } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../../../css/status-messages.css';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useContract from '../../../hooks/useContract';
import { TagType, fade_in } from '../common/common_styles';
import { textAlign } from '@mui/system';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    bgcolor: '#1d1d1d',
    //border: '2px solid rgba(29, 29, 29, 0.3)',
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
    gap: 60px;
`
const CreateRewardWrap = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 20px;
    }
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



export default function AddPolicyModal({ modalOpen, handleClose, selectedStrategy, rewardOptions, availableRules }) {

    const handleSave = async () => {
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
                            <ModalHeading>{selectedStrategy} Voting Strategy</ModalHeading>
                            <ExitButton onClick={() => { handleClose({ type: 'standard' }) }}>exit</ExitButton>
                            {selectedStrategy === 'Token' && <TokenStrategy rewardOptions={rewardOptions} availableRules={availableRules} />}
                        </div>
                    </ModalWrapper>

                </Box>
            </Modal>
        </div>
    );
}


const StrategyContainer = styled.div`
    display: flex;
    flex-direction: column;
    > * {
        margin-bottom: 20px;
    }
`

const TokenDecisionWrap = styled.div`
    display: flex;

    > div:nth-child(1){
        flex: 0 1 40%;
    }

    > div:nth-child(3){
        flex: 0 1 30%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

`

const SplitDecision = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
    flex: 0 1 20%;
`

const ConfirmButton = styled.button`
    border: none;
    border-radius: 4px;
    background-color: lightgreen;
    color: black;
    justify-self: flex-end;
    padding: 5px 10px;
    animation: ${fade_in} 0.5s ease-in-out;
    
    &:hover{
        background-color: rgba(144, 238, 144, 0.8);
    }
`

const AddTokenButton = styled.button`
    padding: 10px 20px;
    border: 2px solid #444c56;
    border-radius: 10px;
    background-color: transparent;

    &:hover{
        background-color: #15191e;
    }
`

function TokenStrategy({ rewardOptions, availableRules }) {
    const [quickAddOptions, setQuickAddOptions] = useState(null);
    const [isAddNewTokenSelected, setIsAddNewTokenSelected] = useState(false);
    const [quickAddSelection, setQuickAddSelection] = useState(-1);

    let options = {};
    // squirrel; add reward options to the mix & remove duplicates
    useEffect(() => { })
    Object.values(availableRules).map((el, index) => {
        // first, strip discord rules
        if (el.gatekeeperType !== 'discord') {
            options[index] = el;
        }
    })

    const handleNewTokenSelect = () => {
        setQuickAddSelection(-1);
        setIsAddNewTokenSelected(true);
    }


    return (
        <StrategyContainer>
            {!isAddNewTokenSelected && <TokenVotingChoice options={options} handleNewTokenSelect={handleNewTokenSelect} quickAddSelection={quickAddSelection} setQuickAddSelection={setQuickAddSelection}/>}
            {isAddNewTokenSelected && <AddNewToken/>}
        </StrategyContainer>
    )
}


function AddNewToken({}){
    return(
        <p>hehehe</p>
    )
}


const QuickAddContainerStyle = styled.div`
    border: none;
    max-height: 300px;
    overflow-y: scroll;

`
const ElementStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 2px solid ${props => props.selected ? 'lightgreen' : '#444c56'};
    margin: 15px 0px;
    padding: 5px;
    cursor: pointer;
    border-radius: 10px;


    &:hover{
        background-color: #15191e;
    }
`
const OptionType = styled.p`
    color: lightgrey;
    margin: 10px 0;
    margin-left: auto;

    & > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`

function TokenVotingChoice({options, handleNewTokenSelect, quickAddSelection, setQuickAddSelection}) {
    return (
        <>
            <div style={{ width: '100%', marginTop: '20px' }} className='tab-message neutral'>
                <p>Choose an erc-20 or erc-721 token used to calculate credits.</p>
            </div>
            <TokenDecisionWrap>
                <div>
                    <h3 style={{ textAlign: 'center' }}>Quick Add</h3>
                    <QuickAddElements elements={options} quickAddSelection={quickAddSelection} setQuickAddSelection={setQuickAddSelection} />
                    {quickAddSelection > -1 && <ConfirmButton>confirm</ConfirmButton>}
                </div>
                <SplitDecision>
                    <h3>OR</h3>
                </SplitDecision>
                <div>
                    <AddTokenButton onClick={handleNewTokenSelect}>Add New Token</AddTokenButton>
                </div>

            </TokenDecisionWrap>
        </>
    )
}

function QuickAddElements({ elements, quickAddSelection, setQuickAddSelection }) {
    return (
        <QuickAddContainerStyle>
            {Object.values(elements).map((el, index) => {
                return (
                    <ElementStyle selected={quickAddSelection === index} onClick={() => setQuickAddSelection(index)}>
                        <p style={{ margin: 0 }}><b>Symbol: </b>{el.gatekeeperSymbol} </p>
                        <OptionType><TagType type={el.gatekeeperType}>{el.gatekeeperType}</TagType></OptionType>
                    </ElementStyle>
                )
            })}
        </QuickAddContainerStyle>
    )
}


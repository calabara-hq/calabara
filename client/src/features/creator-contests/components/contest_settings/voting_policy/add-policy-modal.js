import React, { useState, useEffect, useReducer, useRef } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../../../../css/status-messages.css';
import styled from 'styled-components'
import { TagType, fade_in, Contest_h3, ConfirmButton, Contest_h3_alt_small } from '../../common/common_styles';
import AddNewToken from '../../../../add-token/add_token';
import { ToggleButton } from '../../common/common_components';
import { ERC1155Button, ERC20Button, ERC721Button } from '../../../../../css/token-button-styles';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#1e1e1e',
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





const ModalHeading = styled.p`
    font-size: 30px;
    color: #d9d9d9;
    width: 'fit-content';
`



export default function AddPolicyModal({ modalOpen, handleClose, selectedStrategy, rewardOptions, availableRules, votingStrategy, setVotingStrategy }) {


    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={() => { handleClose({ type: 'standard' }) }}
            >
                <Box sx={style}>
                    <ModalWrapper>
                        <div>
                            <ModalHeading>{selectedStrategy === 0x1 ? 'Token' : 'Arcade'} Voting Strategy</ModalHeading>
                            {selectedStrategy === 0x1 && <TokenStrategy rewardOptions={rewardOptions} availableRules={availableRules} votingStrategy={votingStrategy} setVotingStrategy={setVotingStrategy} handleClose={handleClose} />}
                            {selectedStrategy === 0x2 && <ArcadeStrategy votingStrategy={votingStrategy} setVotingStrategy={setVotingStrategy} handleClose={handleClose} />}
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

const ConfirmSelectionButton = styled.button`
    border: none;
    border-radius: 4px;
    background-color: #04AA6D;
    color: #ffff;
    justify-self: flex-end;
    padding: 5px 10px;
    font-size: 15px;
    font-weight: 550;
    animation: ${fade_in} 0.5s ease-in-out;
    
    &:hover{
        background-color: rgb(4, 170, 109, .6);
        color: #ffff;
        
    }
`

const AddTokenButton = styled.button`
    padding: 10px 20px;
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    background-color: #262626;
    box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    transition: visibility 0.2s, max-height 0.3s ease-in-out;

    &:hover{
        background-color: #1e1e1e;
        transform: scale(1.01);
        transition-duration: 0.5s;

    }
`

const ReplaceStrategy = styled.button`
    width: fit-content;
    padding: 10px 20px;
    border: 2px solid #d95169;
    border-radius: 10px;
    background-color: #262626;
    box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);


    &:hover{
        background-color: #1e1e1e;
    }
`



function TokenStrategy({ rewardOptions, availableRules, votingStrategy, setVotingStrategy, handleClose }) {
    const [quickAddOptions, setQuickAddOptions] = useState(null);
    const [quickAddSelection, setQuickAddSelection] = useState(-1);
    const [triggerNewTokenInputType, setTriggerNewTokenInputType] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [progress, setProgress] = useState(votingStrategy.strategy_id === 0x1 ? 0 : 1);



    let options = {};
    // squirrel; add reward options to the mix & remove duplicates
    Object.values(availableRules).map((el, index) => {
        // first, strip discord rules
        if (el.type !== 'discord') {
            options[index] = el
            console.log(options)

        }
    })

    const handleSaveNewToken = (data) => {
        console.log(data)
        setTokenData(data);
        setProgress(2);
    }

    const handleSave = (additional_configs) => {
        let obj = {
            strategy_type: 'token',
            strategy_id: 0x1,
            data: {
                token_data: tokenData,
                additional_configs: additional_configs
            }
        }

        setVotingStrategy({ type: 'update_all', payload: obj });
        handleClose();
    }


    return (
        <StrategyContainer>
            {progress === 0 && <TokenStrategySummary votingStrategy={votingStrategy} setProgress={setProgress}></TokenStrategySummary>}
            {(progress === 1 && !triggerNewTokenInputType) && <TokenVotingChoice setProgress={setProgress} options={options} quickAddSelection={quickAddSelection} setQuickAddSelection={setQuickAddSelection} setTriggerNewTokenInputType={setTriggerNewTokenInputType} setTokenData={setTokenData} />}
            {(progress === 1 && triggerNewTokenInputType) && <AddNewToken existingRewardData={tokenData} type={triggerNewTokenInputType} showBackButton={true} handleBackButton={() => setTriggerNewTokenInputType(null)} handleNextButton={handleSaveNewToken} />}
            {progress === 2 && <AdditionalConfig tokenData={tokenData} setProgress={setProgress} handleSave={handleSave} handlePrevious={() => setProgress(1)} />}
        </StrategyContainer>
    )
}



////////////////////

const SummaryTokenInfo = styled.div`
    display: flex;
    align-items: center;
`

function TokenStrategySummary({ votingStrategy, setProgress }) {
    let { symbol, type } = votingStrategy.data.token_data;
    let { hardcap_bool, hardcap_limit, max_per_sub_bool, max_per_sub_limit } = votingStrategy.data.additional_configs;
    return (
        <>
            <TagDiv>
                <p style={{ margin: 0 }}><b>Symbol: </b>{votingStrategy.data.token_data.symbol} </p>
                <OptionType><TagType type={type}>{type}</TagType></OptionType>
            </TagDiv>
            <h4><b>1</b> {symbol} equals <b>1</b> voting credit</h4>
            <p><b>Limit per sub:</b> {max_per_sub_bool ? max_per_sub_limit : 'Off'}</p>
            <p><b>Limit per wallet:</b> {hardcap_bool ? hardcap_limit : 'Off'}</p>
            <ReplaceStrategy onClick={() => setProgress(1)}>replace strategy</ReplaceStrategy>
        </>
    )
}

////////////////////


function ArcadeStrategy({ votingStrategy, setVotingStrategy, handleClose }) {
    const [progress, setProgress] = useState(votingStrategy.strategy_id === 0x2 ? 0 : 1);

    const handleSave = (additional_configs) => {
        let { credit_allowance, ...rest } = additional_configs;
        let obj = {
            strategy_type: 'arcade',
            strategy_id: 0x2,
            data: {
                credit_allowance: credit_allowance,
                additional_configs: rest
            }
        }
        setVotingStrategy({ type: 'update_all', payload: obj });
        handleClose();
    }

    return (
        <>
            {progress === 0 && <ArcadeStrategySummary setProgress={setProgress} votingStrategy={votingStrategy} />}
            {progress === 1 && <AdditionalConfig handleSave={handleSave} setProgress={setProgress} />}
        </>
    )
}


function ArcadeStrategySummary({ votingStrategy, setProgress }) {
    let { max_per_sub_bool, max_per_sub_limit } = votingStrategy.data.additional_configs;
    return (
        <>
            <h4>Each qualifying voter recieves <b>{votingStrategy.data.credit_allowance}</b> voting credits.</h4>
            <p><b>Limit per sub:</b> {max_per_sub_bool ? max_per_sub_limit : 'Off'}</p>
            <ReplaceStrategy onClick={() => setProgress(1)}>replace strategy</ReplaceStrategy>
        </>
    )
}

///////////////////////////////////////////////////////////

const AdditionalConfigWrap = styled.div`
    display: flex;
    flex-direction: column;
    color: #d3d3d3;

    > * {
        margin-bottom: 20px;
    }
`
const BackButton = styled.button`
    position: absolute;
    bottom: 2em;
    left: 2em;
    color: #d3d3d3;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 5px 20px;
    font-size: 15px;
    font-weight: 550;
    animation: ${fade_in} 0.5s ease-in-out;

    &:hover{
        background-color: #1e1e1e;
        color: #f2f2f2;
    }

`

const SaveButton = styled.button`
    position: absolute;
    bottom: 2em;
    right: 2em;
    color: #ffff;
    background-color: #04AA6D;
    border: transparent;
    border-radius: 4px;
    padding: 5px 20px;
    font-size: 15px;
    font-weight: 550;
    animation: ${fade_in} 0.5s ease-in-out;
    
    &:hover{
        background-color: rgb(4, 170, 109, .6);
        color: #ffff;
        
    }

`

const TopLevelWrap = styled.div`
    display: flex;
`

const ArcadeCreditAllowance = styled.div`

`
const MaxPerSub = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
    > input{
        flex: 0 0 20px;
    }
`
const Hardcap = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
    > input{
        flex: 0 0 20px;
    }
`

const ArcadeVotes = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 50px;
    > input{
        flex: 0 0 20px;
        margin-left: auto;
    }

`


const SettingDescription = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 40%;
    > * {
        color: #d3d3d3;
    }

`

const CaptureInput = styled.input`
    flex: 1 0 10%;
    color: #f2f2f2;
    border: 2px solid ${props => props.error ? 'rgba(254, 72, 73, 1)' : 'rgb(83, 155, 245)'};
    border-radius: 10px;
    background-color: #121212;
    outline: none;
    padding: 5px 10px;
    height: 40px;
    width: 100px;
    justify-self: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
`





function AdditionalConfig({ tokenData, setProgress, handleSave, handlePrevious }) {
    const [isMaxPerSubOn, setIsMaxPerSubOn] = useState(false);
    const [isHardcapOn, setIsHardcapOn] = useState(false);
    const [maxPerSubLimit, setMaxPerSubLimit] = useState(0);
    const [hardcapLimit, setHardcapLimit] = useState(0);
    const [arcadeCredits, setArcadeCredits] = useState(0);
    const [isHardcapError, setIsHardcapError] = useState(false);
    const [isMaxPerSubError, setIsMaxPerSubError] = useState(false);
    const [isCreditError, setIsCreditError] = useState(false);


    const handleMaxPerSubToggle = () => {
        if (isMaxPerSubOn) {
            setMaxPerSubLimit(0);
            setIsMaxPerSubOn(false);
            setIsMaxPerSubError(false);
        }
        else {
            setIsMaxPerSubOn(true);
        }
    }

    const handleMaxPerSubChange = (e) => {
        setMaxPerSubLimit(Math.round(Math.abs(e.target.value)))
        if (isMaxPerSubError) setIsMaxPerSubError(false)
    }


    const handleHardcapToggle = () => {
        if (isHardcapOn) {
            setHardcapLimit(0);
            setIsHardcapOn(false);
            setIsHardcapError(false);
        }
        else {
            setIsHardcapOn(true);
        }
    }

    const handleHardcapChange = (e) => {
        setHardcapLimit(Math.round(Math.abs(e.target.value)))
        if (isHardcapError) setIsHardcapError(false)
    }

    const handleArcadeCreditChange = (e) => {
        setArcadeCredits(Math.round(Math.abs(e.target.value)))
        setIsCreditError(false)
    }

    const prepareSave = (type) => {
        if (type === 'token') {
            if (isHardcapOn && hardcapLimit <= 0) return setIsHardcapError(true)
            if (isMaxPerSubOn && maxPerSubLimit <= 0) return setIsMaxPerSubError(true)
            handleSave({ hardcap_bool: isHardcapOn, hardcap_limit: hardcapLimit, max_per_sub_bool: isMaxPerSubOn, max_per_sub_limit: maxPerSubLimit })

        }
        else if (type === 'arcade') {
            if (arcadeCredits <= 0) return setIsCreditError(true)
            if (isMaxPerSubOn && maxPerSubLimit <= 0) return setIsMaxPerSubError(true)
            handleSave({ credit_allowance: arcadeCredits, max_per_sub_bool: isMaxPerSubOn, max_per_sub_limit: maxPerSubLimit })
        }
    }

    return (
        <AdditionalConfigWrap>
            {tokenData &&
                <>
                    <MaxPerSub>
                        <SettingDescription>
                            <Contest_h3_alt_small >Submission Hard Cap</Contest_h3_alt_small>
                            <p style={{ color: '#a3a3a3' }}>Limit # of usable voting credits on a single submission. </p>
                        </SettingDescription>
                        <ToggleButton identifier={'max-per-sub-toggle'} isToggleOn={isMaxPerSubOn} setIsToggleOn={setIsMaxPerSubOn} handleToggle={handleMaxPerSubToggle} />
                        {isMaxPerSubOn && <CaptureInput error={isMaxPerSubError} onWheel={(e) => e.target.blur()} type={'number'} value={maxPerSubLimit || ''} onChange={handleMaxPerSubChange}></CaptureInput>}
                    </MaxPerSub>
                    <Hardcap>
                        <SettingDescription>
                            <Contest_h3_alt_small >Contest Hard cap</Contest_h3_alt_small>
                            <p style={{ color: '#a3a3a3' }}>Limit # of usable voting credits across the entire contest.</p>
                        </SettingDescription>
                        <ToggleButton identifier={'hardcap-toggle'} isToggleOn={isHardcapOn} setIsToggleOn={setIsHardcapOn} handleToggle={handleHardcapToggle} />
                        {isHardcapOn && <CaptureInput error={isHardcapError} onWheel={(e) => e.target.blur()} type={'number'} value={hardcapLimit || ''} onChange={handleHardcapChange}></CaptureInput>}
                        <BackButton onClick={handlePrevious}>back</BackButton>
                        <SaveButton onClick={() => prepareSave('token')}>save</SaveButton>
                    </Hardcap>
                </>
            }


            {!tokenData &&
                <>
                    <TopLevelWrap>

                        <ArcadeVotes>
                            <Contest_h3_alt_small>Voting credits per qualifying participant</Contest_h3_alt_small>
                            <CaptureInput error={isCreditError} onWheel={(e) => e.target.blur()} type={"number"} value={arcadeCredits || ''} onChange={handleArcadeCreditChange}></CaptureInput>
                        </ArcadeVotes>
                    </TopLevelWrap>
                    <MaxPerSub>
                        <SettingDescription>
                            <Contest_h3_alt_small>Max per Submission</Contest_h3_alt_small>
                            <p style={{ color: '#a3a3a3' }}>Limit # of usable voting credits on a single submission. </p>
                        </SettingDescription>
                        <ToggleButton identifier={'max-per-sub-toggle'} isToggleOn={isMaxPerSubOn} setIsToggleOn={setIsMaxPerSubOn} handleToggle={handleMaxPerSubToggle} />
                        {isMaxPerSubOn && <CaptureInput error={isMaxPerSubError} onWheel={(e) => e.target.blur()} type={'number'} value={maxPerSubLimit || ''} onChange={handleMaxPerSubChange}></CaptureInput>}
                    </MaxPerSub>
                    {handlePrevious && <BackButton onClick={handlePrevious}>back</BackButton>}
                    <SaveButton onClick={() => prepareSave('arcade')}>save</SaveButton>
                </>
            }

        </AdditionalConfigWrap>
    )

}

///////////////////////////////////////////////////////////



const QuickAddContainerStyle = styled.div`
    border: none;
    max-height: 300px;
    overflow-y: scroll;

`
const TagDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #262626;
    box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    border: 2px solid ${props => props.selected ? '#04aa6d' : '#4d4d4d'};
    margin: 15px 0px;
    padding: 5px;
    cursor: ${props => props.selectable ? 'pointer' : 'default'};
    border-radius: 10px;


    &:hover{
        background-color: ${props => props.selectable ? '#1e1e1e' : 'null'};
        
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




function TokenVotingChoice({ options, quickAddSelection, setQuickAddSelection, setTriggerNewTokenInputType, setTokenData, setProgress }) {
    const [isAddNewTokenSelected, setIsAddNewTokenSelected] = useState(false);

    const handleNewTokenSelect = () => {
        setIsAddNewTokenSelected(true);
        setQuickAddSelection(-1);
    }
    return (
        <>
            <div style={{ width: 'fit-content', marginTop: '20px' }} className='tab-message neutral'>
                <p>Choose an erc-20 or erc-721 token used to calculate credits.</p>
            </div>
            <TokenDecisionWrap>
                <div>
                    <h3 style={{ textAlign: 'center' }}>Quick Add</h3>
                    <QuickAddElements elements={options} quickAddSelection={quickAddSelection} setQuickAddSelection={setQuickAddSelection} setTokenData={setTokenData} setProgress={setProgress} />
                    {quickAddSelection > -1 && <ConfirmSelectionButton onClick={() => setProgress(2)}>confirm</ConfirmSelectionButton>}
                </div>
                <SplitDecision>
                    <h3>OR</h3>
                </SplitDecision>
                <div>
                    {!isAddNewTokenSelected && <AddTokenButton onClick={handleNewTokenSelect}>Add New Token</AddTokenButton>}
                    {isAddNewTokenSelected && <NewTokenSelectType setTriggerNewTokenInputType={setTriggerNewTokenInputType} setTokenData={setTokenData} />}
                </div>

            </TokenDecisionWrap>
        </>
    )
}

const NewTokenChoice = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    > * {
        margin: 10px;
        padding: 10px 15px;
    }
    
`
function NewTokenSelectType({ setTriggerNewTokenInputType, setTokenData }) {

    const handleSelect = (type) => {
        setTokenData(null)
        setTriggerNewTokenInputType(type)
    }
    return (
        <NewTokenChoice>
            <h3 style={{ textAlign: 'center' }}>New Token</h3>
            <ERC20Button onClick={() => handleSelect('erc20')}>erc-20</ERC20Button>
            <ERC721Button onClick={() => handleSelect('erc721')}>erc-721</ERC721Button>
            <ERC1155Button onClick={() => handleSelect('erc1155')}>erc-1155</ERC1155Button>
        </NewTokenChoice>
    )
}


function QuickAddElements({ elements, quickAddSelection, setQuickAddSelection, setTokenData, setProgress }) {

    const handleSelect = (index, el) => {
        setQuickAddSelection(index);
        setTokenData(el);
    }

    return (
        <QuickAddContainerStyle>
            {Object.values(elements).map((el, index) => {
                return (
                    <TagDiv selected={quickAddSelection === index} selectable={true} onClick={() => handleSelect(index, el)}>
                        <p style={{ margin: 0 }}><b>Symbol: </b>{el.symbol} </p>
                        <OptionType><TagType type={el.type}>{el.type}</TagType></OptionType>
                    </TagDiv>
                )
            })}
        </QuickAddContainerStyle>
    )
}


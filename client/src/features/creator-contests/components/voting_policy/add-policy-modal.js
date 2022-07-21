import React, { useState, useEffect, useReducer, useRef } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import '../../../../css/status-messages.css';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useContract from '../../../hooks/useContract';
import { TagType, fade_in, Contest_h3 } from '../common/common_styles';
import { textAlign } from '@mui/system';
import AddNewToken from '../common/add_token';
import ToggleOption from '../toggle_option/toggle-option';
import { ToggleButton } from '../common/common_components';


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



export default function AddPolicyModal({ modalOpen, handleClose, selectedStrategy, rewardOptions, availableRules, votingStrategy, setVotingStrategy }) {

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
                            <ModalHeading>{selectedStrategy === 0x1 ? 'Token' : 'Arcade'} Voting Strategy</ModalHeading>
                            <ExitButton onClick={() => { handleClose({ type: 'standard' }) }}>exit</ExitButton>
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

const ConfirmButton = styled.button`
    border: none;
    border-radius: 4px;
    background-color: rgb(26, 188, 156);
    color: black;
    justify-self: flex-end;
    padding: 5px 10px;
    animation: ${fade_in} 0.5s ease-in-out;
    
    &:hover{
        background-color: rgba(26, 188, 156, 0.8);
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

function TokenStrategy({ rewardOptions, availableRules, votingStrategy, setVotingStrategy, handleClose }) {
    const [quickAddOptions, setQuickAddOptions] = useState(null);
    const [quickAddSelection, setQuickAddSelection] = useState(-1);
    const [triggerNewTokenInputType, setTriggerNewTokenInputType] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [progress, setProgress] = useState(votingStrategy.strategy_id === 0x1 ? 0 : 1);

    console.log(votingStrategy)

    let options = {};
    // squirrel; add reward options to the mix & remove duplicates
    useEffect(() => { })
    Object.values(availableRules).map((el, index) => {
        // first, strip discord rules
        if (el.gatekeeperType !== 'discord') {
            let data = {
                type: el.gatekeeperType,
                symbol: el.gatekeeperSymbol,
                decimal: el.gatekeeperDecimal,
                address: el.gatekeeperAddress
            }
            options[index] = data


        }
    })

    const handleSaveNewToken = (data) => {
        setTokenData(data);
        setProgress(1);
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
            <ElementStyle>
                <p style={{ margin: 0 }}><b>Symbol: </b>{votingStrategy.data.token_data.symbol} </p>
                <OptionType><TagType type={type}>{type}</TagType></OptionType>
            </ElementStyle>
            <h4><b>1</b> {symbol} equals <b>1</b> voting credit</h4>
            <p><b>Limit per sub:</b> {max_per_sub_bool ? max_per_sub_limit : 'Off'}</p>
            <p><b>Limit per wallet:</b> {hardcap_bool ? hardcap_limit : 'Off'}</p>
            <button style={{ color: 'black' }} onClick={() => setProgress(1)}>replace strategy</button>
        </>
    )
}

////////////////////


function ArcadeStrategy({ votingStrategy, setVotingStrategy, handleClose }) {
    const [progress, setProgress] = useState(votingStrategy.strategy_id === 0x2 ? 0 : 1);

    const handleSave = (additional_configs) => {
        let {credit_allowance, ...rest} = additional_configs;
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
            <button onClick={() => setProgress(1)}>replace strategy</button>
        </>
    )
}

///////////////////////////////////////////////////////////

const AdditionalConfigWrap = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 20px;
    }
`
const BackButton = styled.button`
    position: absolute;
    bottom: 0;
    left: 0;
    color: black;
`
const NextButton = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
    color: black;
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
    > div:nth-child(2){
        flex: 1 0 20%;
    }
`
const Hardcap = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
    > div:nth-child(2){
        flex: 1 0 20%;
    }
`

const SettingDescription = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 40%;
`

const CaptureInput = styled.div`
    flex: 1 0 10%;
    color: black;
`



function AdditionalConfig({ tokenData, setProgress, handleSave, handlePrevious }) {
    const [isMaxPerSubOn, setIsMaxPerSubOn] = useState(false);
    const [isHardcapOn, setIsHardcapOn] = useState(false);
    const [maxPerSubLimit, setMaxPerSubLimit] = useState(0);
    const [hardcapLimit, setHardcapLimit] = useState(0);
    const [arcadeCredits, setArcadeCredits] = useState(0);

    const tokenDisplay = () => {
        return (
            <TopLevelWrap>
                <h4><b>1</b> {tokenData.symbol} equals <b>1</b> voting credit</h4>
            </TopLevelWrap>
        )
    }

    const arcadeDisplay = () => {
        return (
            <TopLevelWrap>
                <p>Voting credits per qualifying participant</p>
                <input style={{ color: 'black' }} onChange={(e) => setHardcapLimit(Number(e.target.value))}></input>
            </TopLevelWrap>
        )
    }

    const handleMaxPerSubToggle = () => {
        if (isMaxPerSubOn) {
            setMaxPerSubLimit(0);
            setIsMaxPerSubOn(false);
        }
        else {
            setIsMaxPerSubOn(true);
        }
    }

    const handleHardcapToggle = () => {
        if (isHardcapOn) {
            setHardcapLimit(0);
            setIsHardcapOn(false);
        }
        else {
            setIsHardcapOn(true);
        }
    }

    console.log(handlePrevious)

    return (
        <AdditionalConfigWrap>
            {tokenData &&
                <>
                    <TopLevelWrap>
                        <h4><b>1</b> {tokenData.symbol} equals <b>1</b> voting credit</h4>
                    </TopLevelWrap>
                    <MaxPerSub>
                        <SettingDescription>
                            <Contest_h3 >Max per Submission</Contest_h3>
                            <p style={{ color: '#a3a3a3' }}>Limit # of usable voting credits on a single submission. </p>
                        </SettingDescription>
                        <ToggleButton identifier={'max-per-sub-toggle'} isToggleOn={isMaxPerSubOn} setIsToggleOn={setIsMaxPerSubOn} handleToggle={handleMaxPerSubToggle} />
                        {isMaxPerSubOn && <CaptureInput><input type={'number'} onChange={(e) => setMaxPerSubLimit(Number(e.target.value))}></input></CaptureInput>}
                    </MaxPerSub>
                    <Hardcap>
                        <SettingDescription>
                            <Contest_h3 >Hard cap</Contest_h3>
                            <p style={{ color: '#a3a3a3' }}>Limit # of usable voting credits across the entire contest.</p>
                        </SettingDescription>
                        <ToggleButton identifier={'hardcap-toggle'} isToggleOn={isHardcapOn} setIsToggleOn={setIsHardcapOn} handleToggle={handleHardcapToggle} />
                        {isHardcapOn && <CaptureInput><input type={'number'} onChange={(e) => setHardcapLimit(Number(e.target.value))}></input></CaptureInput>}
                    </Hardcap>
                    <BackButton onClick={handlePrevious}>back</BackButton>
                    <NextButton onClick={() => handleSave({ hardcap_bool: isHardcapOn, hardcap_limit: hardcapLimit, max_per_sub_bool: isMaxPerSubOn, max_per_sub_limit: maxPerSubLimit })}>save</NextButton>
                </>
            }


            {!tokenData &&
                <>
                    <TopLevelWrap>
                        <p>Voting credits per qualifying participant</p>
                        <input type={"number"} style={{ color: 'black' }} onChange={(e) => setArcadeCredits(Number(e.target.value))}></input>
                    </TopLevelWrap>
                    <MaxPerSub>
                        <SettingDescription>
                            <Contest_h3 >Max per Submission</Contest_h3>
                            <p style={{ color: '#a3a3a3' }}>Limit # of usable voting credits on a single submission. </p>
                        </SettingDescription>
                        <ToggleButton identifier={'max-per-sub-toggle'} isToggleOn={isMaxPerSubOn} setIsToggleOn={setIsMaxPerSubOn} handleToggle={handleMaxPerSubToggle} />
                        {isMaxPerSubOn && <CaptureInput><input type={'number'} onChange={(e) => setMaxPerSubLimit(Number(e.target.value))}></input></CaptureInput>}
                    </MaxPerSub>
                    {handlePrevious && <BackButton onClick={handlePrevious}>back</BackButton>}
                    <NextButton onClick={() => handleSave({ credit_allowance: arcadeCredits, max_per_sub_bool: isMaxPerSubOn, max_per_sub_limit: maxPerSubLimit })}>save</NextButton>
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
const ElementStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 2px solid ${props => props.selected ? 'rgb(26, 188, 156)' : '#444c56'};
    margin: 15px 0px;
    padding: 5px;
    cursor: ${props => props.selectable ? 'pointer' : 'default'};
    border-radius: 10px;


    &:hover{
        background-color: ${props => props.selectable ? '#15191e' : 'null'};
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
            <div style={{ width: '100%', marginTop: '20px' }} className='tab-message neutral'>
                <p>Choose an erc-20 or erc-721 token used to calculate credits.</p>
            </div>
            <TokenDecisionWrap>
                <div>
                    <h3 style={{ textAlign: 'center' }}>Quick Add</h3>
                    <QuickAddElements elements={options} quickAddSelection={quickAddSelection} setQuickAddSelection={setQuickAddSelection} setTokenData={setTokenData} setProgress={setProgress} />
                    {quickAddSelection > -1 && <ConfirmButton onClick={() => setProgress(2)}>confirm</ConfirmButton>}
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
    background-color: orange;
    align-items: center;
    justify-content: center;
    > * {
        margin: 10px;
        padding: 5px 10px;
        color: black;
    }
    
`
function NewTokenSelectType({ setTriggerNewTokenInputType, setTokenData }) {

    const handleSelect = (type) => {
        setTokenData(null)
        setTriggerNewTokenInputType(type)
    }
    return (
        <NewTokenChoice>
            <button onClick={() => handleSelect('erc20')}>erc-20</button>
            <button onClick={() => handleSelect('erc721')}>erc-721</button>
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
                    <ElementStyle selected={quickAddSelection === index} selectable={true} onClick={() => handleSelect(index, el)}>
                        <p style={{ margin: 0 }}><b>Symbol: </b>{el.symbol} </p>
                        <OptionType><TagType type={el.type}>{el.type}</TagType></OptionType>
                    </ElementStyle>
                )
            })}
        </QuickAddContainerStyle>
    )
}


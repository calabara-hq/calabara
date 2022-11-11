import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { TagType } from '../../common/common_styles';



const GkRule = styled.div`

    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    grid-gap: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    border: 2px solid ${props => props.error ? 'rgb(235, 87, 87)' : '#4d4d4d'};
    border-radius: 4px;
    background-color: #262626;
    padding: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    //height: 190px;

    > p  {
        margin: 0;
        color: #d3d3d3;
        align-self: flex-start;

    }

`


const ToggleFlex = styled.div`

    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    width: 100%;
    margin-top: auto;
    

    > button  {
        height: 40px;
        width: 120px;
        font-size: 15px;
        font-weight: 550;
        color: rgb(88, 101, 242);
        background-color: rgb(88, 101, 242, .3);
        border: 2px solid rgb(88, 101, 242, .3);
        border-radius: 10px;
        padding: 5px 10px;
        text-align: center;
        margin-left: auto;
        cursor: pointer;

        &:hover {
            background-color: rgb(88, 101, 242);
            color: #fff;
        }
    }

`
const GKInput = styled.input`
    animation: fadein 1s forwards;
    height: 40px;
    width: 111px;
    font-size: 15px;
    font-weight: 550;
    color: white;
    background-color: #121212;
    border: 2px solid ${props => props.error ? 'rgba(254,72,73,1)' : 'rgb(83,155,245)'};
    border-radius: 10px;
    outline: none;
    padding: 5px 10px;
    align-self: center;
    text-align: center;
    margin-left: auto;
`


const TokenLink = styled.span`
    cursor: pointer;

    > i {color: grey};

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

const TokenType = styled.p`
    color: lightgrey;
    margin: 0;

    > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`

export default function ToggleOption({ availableRestrictions, updateAvailableRestrictions, restriction_errors, toggle_identifier }) {

    return (
        <div className="apply-gatekeeper-rules">

            {availableRestrictions.map((value, index) => {
                return (
                    <Option key={index} error={restriction_errors[index]} element={value} option_id={index} updateAvailableRestrictions={updateAvailableRestrictions} toggle_identifier={toggle_identifier} />
                )
            })}

        </div>
    )
}



function Option({ element, option_id, updateAvailableRestrictions, error, toggle_identifier }) {

    const [isGatekeeperOn, setIsGatekeeperOn] = useState(false);
    const dispatch = useDispatch();

    /*
    useEffect(() => {
        setIsGatekeeperOn(appliedRules[option_id] != undefined)
    }, [appliedRules])
    */

    const enableRestriction = (e) => {
        //setAppliedRules({ type: 'update_single', payload: { [option_id]: "" } })
        dispatch(updateAvailableRestrictions({ index: option_id, update_type: 'enable', payload: null }))
        //setRuleError({ [option_id]: "" })
    }

    const disableRestriction = () => {
        dispatch(updateAvailableRestrictions({ index: option_id, update_type: 'disable', payload: null }))
    }

    const handleThresholdChange = (e) => {
        dispatch(updateAvailableRestrictions({ index: option_id, update_type: 'update', payload: Math.round(Math.abs(e.target.value)) || '' }))

        /*
        console.log('here')
        let objCopy = { ...ruleOption }
        objCopy['threshold'] = Math.round(Math.abs(e.target.value)) || ''
        setAppliedRules({ type: 'update_single', payload: { [option_id]: objCopy } })
        */
        //setRuleError(false)
    }

    /*
    discord integration

    const [roleModalOpen, setRoleModalOpen] = useState(false)

    
    const open = () => {
        setRoleModalOpen(true)
    }
    const close = (event, reason) => {
        if (reason && reason === 'backdropClick') return
        setRoleModalOpen(false)
    }
    
    const handleAddDiscordRule = (val) => {

        setAppliedRules({ type: 'update_single', payload: { [option_id]: { type: 'discord', roles: val } } })
    }
    */


    if (element.type === 'erc721' || element.type === 'erc20') {
        return (
            <GkRule error={error} >
                <TokenType><b>Type:</b> <TagType type={element.type}>{element.type}</TagType></TokenType>
                <p><b>Symbol: </b>
                    <TokenLink onClick={() => { window.open('https://etherscan.io/address/' + element.address) }}> {element.symbol} <i className="fas fa-external-link-alt"></i></TokenLink>
                </p>
                <ToggleFlex>
                    <ToggleSwitch enableRestriction={enableRestriction} disableRestriction={disableRestriction} option_id={option_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} toggle_identifier={toggle_identifier} />
                    {isGatekeeperOn &&
                        <GKInput onWheel={(e) => e.target.blur()} type="number" error={error} value={element.threshold} placeholder="threshold" onChange={handleThresholdChange}></GKInput>
                    }
                </ToggleFlex>
            </GkRule>
        )
    }

    else if (element.type === 'erc1155') {
        return (
            <GkRule error={error} >
                <TokenType><b>Type:</b> <TagType type={element.type}>{element.type}</TagType></TokenType>
                <p><b>Symbol: </b>
                    <TokenLink onClick={() => { window.open('https://etherscan.io/address/' + element.address) }}> {element.symbol} <i className="fas fa-external-link-alt"></i></TokenLink>
                </p>
                <p><b>Token ID: </b>{element.token_id}</p>
                <ToggleFlex>
                    <ToggleSwitch enableRestriction={enableRestriction} disableRestriction={disableRestriction} option_id={option_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} toggle_identifier={toggle_identifier} />
                    {isGatekeeperOn &&
                        <GKInput onWheel={(e) => e.target.blur()} type="number" error={error} value={element.threshold} placeholder="threshold" onChange={handleThresholdChange}></GKInput>
                    }
                </ToggleFlex>
            </GkRule>
        )
    }

    /*
    return (
        <>
            <GkRule error={error} >
                {(element.type === 'erc721' || element.type === 'erc20') &&
                    <>
                        <p><b>Type:</b> <Tag tagtype={element.type}>{element.type}</Tag></p>
                        <p><b>Symbol: </b>
                            <TokenLink onClick={() => { window.open('https://etherscan.io/address/' + element.address) }}> {element.symbol} <i className="fas fa-external-link-alt"></i></TokenLink>
                        </p>
                        <ToggleFlex>
                            <ToggleSwitch enableRestriction={enableRestriction} disableRestriction={disableRestriction} option_id={option_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} toggle_identifier={toggle_identifier} />
                            {isGatekeeperOn &&
                                <GKInput onWheel={(e) => e.target.blur()} type="number" error={error} value={element.threshold} placeholder="threshold" onChange={handleThresholdChange}></GKInput>
                            }
                        </ToggleFlex>
                    </>
                }
                {(element.type === 'discord') &&
                    <>
                        <p><b>Type:</b> <Tag tagtype={element.type}>{element.type}</Tag></p>
                        <p><b>Server:</b> {element.serverName}</p>
                        <ToggleFlex>
                            <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} option_id={option_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} toggle_identifier={toggle_identifier} />
                            {isGatekeeperOn &&
                                <>
                                    <button onClick={open}>select roles</button>
                                    {roleModalOpen && <RoleSelectModal handleAddDiscordRule={handleAddDiscordRule} handleClose={close} modalOpen={roleModalOpen} existingRoles={appliedRules[option_id] || []} />}
                                </>
                            }
                        </ToggleFlex>
                    </>
                        }
            </GkRule>
        </>
    )
    */
}


function ToggleSwitch({ option_id, enableRestriction, disableRestriction, isGatekeeperOn, setIsGatekeeperOn, toggle_identifier }) {


    const handleToggle = () => {

        if (!isGatekeeperOn) {
            // gatekeeper just flipped on. Add it to applied rules
            enableRestriction();
        }
        else {
            //  gatekeeper just flipped off delete it from applied rules
            disableRestriction();
        }
        setIsGatekeeperOn(!isGatekeeperOn)
    }




    return (
        <div>
            <input checked={isGatekeeperOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle-${toggle_identifier}-${option_id}`} type="checkbox" />
            <label style={{ background: isGatekeeperOn && '#539bf5' }} className="react-switch-label" htmlFor={`react-switch-toggle-${toggle_identifier}-${option_id}`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}



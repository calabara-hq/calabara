import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import RoleSelectModal from '../../../../manage-widgets/role-select-modal'
import styled from 'styled-components'
import {
    selectDashboardRules,
} from '../../../../../features/gatekeeper/gatekeeper-rules-reducer';

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
    min-height: 150px;

    > p  {
        margin: 0;
        color: #d3d3d3;
        align-self: flex-start;

    }

`

const Tag = styled.span`

            color: #f2f2f2;
            background-color: ${props => props.tagtype === 'erc20' ? '#03b09f' : (props.tagtype == 'erc721' ? '#ab6afb' : '#5865f2')};
            padding: 3px 3px;
            border-radius: 5px;
            font-size: 15px;
            font-weight: 550;



`

const ToggleFlex = styled.div`

display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    
    > input  {
        animation: fadein 1s forwards;
        height: 40px;
        width: 111px;
        font-size: 15px;
        font-weight: 550;
        color: white;
        background-image: linear-gradient(#141416, #141416), 
                        linear-gradient(to right, #e00f8e, #2d66dc);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border: double 2px transparent;
        border-radius: 10px;
        outline: none;
        padding: 5px 10px;
        align-self: center;
        text-align: center;
        margin-left: auto;

    }

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

const TokenLink = styled.span`
cursor: pointer;

> i {color: grey};


`




export default function ToggleOption({ appliedRules, setAppliedRules, ruleError, setRuleError, toggle_identifier }) {
    // fetch available rules
    let availableRules = useSelector(selectDashboardRules);
    // 

    /******************/



    let rules = {};
    Object.entries(availableRules).map(([key, val], index) => {
        if (val.type !== 'discord') {
            rules[index] = val;
        }
    })

    availableRules = JSON.parse(JSON.stringify(rules));

    /******************/

    return (
        <div className="apply-gatekeeper-rules">
            {Object.entries(availableRules).map(([option_id, value]) => {
                return (
                    <Option ruleError={ruleError} key={option_id} setRuleError={setRuleError} element={value} option_id={option_id} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} ruleOption={value} />
                )
            })}
        </div>
    )
}



function Option({ element, option_id, appliedRules, setAppliedRules, ruleError, setRuleError, toggle_identifier, ruleOption }) {

    const [isGatekeeperOn, setIsGatekeeperOn] = useState(appliedRules[option_id] != undefined)
    const [roleModalOpen, setRoleModalOpen] = useState(false)

    const open = () => {
        setRoleModalOpen(true)
    }
    const close = (event, reason) => {
        if (reason && reason === 'backdropClick') return
        setRoleModalOpen(false)
    }


    useEffect(() => {
        setIsGatekeeperOn(appliedRules[option_id] != undefined)
    }, [appliedRules])


    const addRule = (e) => {
        setAppliedRules({ type: 'update_single', payload: { [option_id]: "" } })
        setRuleError({ [option_id]: "" })
    }

    const deleteRule = () => {
        let objCopy = { ...appliedRules };
        delete objCopy[option_id];
        setAppliedRules({ type: 'update_all', payload: objCopy })
    }

    const handleThresholdChange = (e) => {
        let objCopy = { ...ruleOption }
        objCopy['threshold'] = e.target.value
        setAppliedRules({ type: 'update_single', payload: { [option_id]: objCopy } })
        setRuleError(false)
    }

    const handleAddDiscordRule = (val) => {
        
        setAppliedRules({ type: 'update_single', payload: { [option_id]: { type: 'discord', roles: val } } })
    }

    return (
        <>
            <GkRule error={ruleError.id == option_id} >
                {(element.type === 'erc721' || element.type === 'erc20') &&
                    <>
                        <p><b>Type:</b> <Tag tagtype={element.type}>{element.type}</Tag></p>
                        <p><b>Symbol: </b>
                            <TokenLink onClick={() => { window.open('https://etherscan.io/address/' + element.address) }}> {element.symbol} <i className="fas fa-external-link-alt"></i></TokenLink>
                        </p>
                        <ToggleFlex>
                            <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} option_id={option_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} />
                            {isGatekeeperOn &&
                                <>
                                    <input onWheel={(e) => e.target.blur()} type="number" value={appliedRules[option_id]['threshold']} placeholder="threshold" onChange={handleThresholdChange}></input>

                                </>
                            }
                        </ToggleFlex>
                    </>
                }
                {/*(element.type === 'discord') &&
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
                        */}
            </GkRule>

            {ruleError.id == option_id &&
                <div className="tab-message error" style={{ width: '100%' }}>
                    {element.type !== 'discord' && <p>Please enter a threshold</p>}
                    {element.type === 'discord' && <p>Selected roles cannot be left blank</p>}

                </div>
            }
        </>
    )
}


function ToggleSwitch({ addRule, setRuleError, deleteRule, ruleError, option_id, isGatekeeperOn, setIsGatekeeperOn, toggle_identifier }) {


    const handleToggle = () => {

        if (!isGatekeeperOn) {
            // gatekeeper just flipped on. Add it to applied rules
            addRule();
        }
        else {
            //  gatekeeper just flipped off delete it from applied rules
            deleteRule();
            if (ruleError.id === option_id) {
                setRuleError({ [option_id]: '' })
            }
        }
        setIsGatekeeperOn(!isGatekeeperOn)
    }




    return (
        <div>
            <input checked={isGatekeeperOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle-${toggle_identifier}-${option_id}`} type="checkbox" />
            <label style={{ background: isGatekeeperOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle-${toggle_identifier}-${option_id}`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}



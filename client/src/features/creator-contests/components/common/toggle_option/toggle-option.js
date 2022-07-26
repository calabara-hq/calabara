import React, { useEffect, useState } from 'react'
import '../../../../../css/gatekeeper-toggle.css'
import { useSelector } from 'react-redux';
import RoleSelectModal from '../../../../manage-widgets/role-select-modal'

import {
    selectDashboardRules,
} from '../../../../../features/gatekeeper/gatekeeper-rules-reducer';

export default function ToggleOption({ appliedRules, setAppliedRules, ruleError, setRuleError, toggle_identifier }) {
    // fetch available rules
   // const availableRules = useSelector(selectDashboardRules);
   // console.log(availableRules)

    /******************/

    let availableRules = {
        "55": {
            "guildId": "892877917762244680",
            "serverName": "Calabara",
            "gatekeeperType": "discord",
            "available_roles": [
                {
                    "role_id": "892877917762244680",
                    "role_name": "@everyone",
                    "role_color": 0
                },
                {
                    "role_id": "893184621523660850",
                    "role_name": "core-team",
                    "role_color": 15105570
                },
                {
                    "role_id": "895903844926623785",
                    "role_name": "bot",
                    "role_color": 6323595
                },
                {
                    "role_id": "896082699402510377",
                    "role_name": "member",
                    "role_color": 15277667
                },
                {
                    "role_id": "896088160684089447",
                    "role_name": "MEE6",
                    "role_color": 0
                },
                {
                    "role_id": "899761111476359269",
                    "role_name": "szn1",
                    "role_color": 1752220
                },
                {
                    "role_id": "907775296659390496",
                    "role_name": "OG calabarator",
                    "role_color": 15844367
                },
                {
                    "role_id": "908035108861251605",
                    "role_name": "sesh",
                    "role_color": 0
                },
                {
                    "role_id": "919991694030671893",
                    "role_name": "carl-bot",
                    "role_color": 0
                },
                {
                    "role_id": "919994529912881192",
                    "role_name": "onboardee",
                    "role_color": 10181046
                },
                {
                    "role_id": "956696519384391703",
                    "role_name": "calabara",
                    "role_color": 11342935
                },
                {
                    "role_id": "974402409533149217",
                    "role_name": "Member",
                    "role_color": 0
                }
            ]
        },
        "64": {
            "gatekeeperType": "erc20",
            "gatekeeperSymbol": "SHARK",
            "gatekeeperAddress": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
            "gatekeeperDecimal": "18"
        },
        "72": {
            "gatekeeperType": "erc721",
            "gatekeeperSymbol": "NOUN",
            "gatekeeperAddress": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"
        },
        "73": {
            "gatekeeperType": "erc721",
            "gatekeeperSymbol": "MFER",
            "gatekeeperAddress": "0x79FCDEF22feeD20eDDacbB2587640e45491b757f"
        }
    }

    let rules2 = {};
    Object.entries(availableRules).map(([key, val], index) => {
        rules2[index] = val;
    })

    availableRules = JSON.parse(JSON.stringify(rules2));

    /******************/

    return (
        <div className="apply-gatekeeper-rules">
            {Object.entries(availableRules).map(([option_id, value]) => {
                return (
                    <Option ruleError={ruleError} key={option_id} setRuleError={setRuleError} element={value} option_id={option_id} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} ruleOption={value}/>
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
        let objCopy = {...ruleOption}
        objCopy['threshold'] = e.target.value
        setAppliedRules({ type: 'update_single', payload: { [option_id]: objCopy } })
        setRuleError(false)
    }

    const handleAddDiscordRule = (val) => {
        setAppliedRules({ type: 'update_single', payload: { [option_id]: val } })
    }

    return (
        <>
            <div className={'gk-rule ' + (ruleError.id == option_id ? 'error' : 'undefined')}>
                {(element.gatekeeperType === 'erc721' || element.gatekeeperType === 'erc20') &&
                    <>
                        <p><b>Type:</b> <span className={element.gatekeeperType}>{element.gatekeeperType}</span></p>
                        <p><b>Symbol: </b>
                            <span onClick={() => { window.open('https://etherscan.io/address/' + element.gatekeeperAddress) }} className='gatekeeper-symbol'>{element.gatekeeperSymbol}  <i className="fas fa-external-link-alt"></i></span>
                        </p>
                        <div className="toggle-flex">
                            <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} option_id={option_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} />
                            {isGatekeeperOn &&
                                <>
                                    <input type="number" value={appliedRules[option_id]['threshold']} placeholder="threshold" onChange={handleThresholdChange}></input>

                                </>
                            }
                        </div>
                    </>
                }
                {(element.gatekeeperType === 'discord') &&
                    <>
                        <p><b>Type:</b> <span className={element.gatekeeperType}>{element.gatekeeperType}</span></p>
                        <p><b>Server:</b> {element.serverName}</p>
                        <div className="toggle-flex">
                            <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} option_id={option_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} toggle_identifier={toggle_identifier} />
                            {isGatekeeperOn &&
                                <>
                                    <button className="select-roles primary-gradient-button" onClick={open}>select roles</button>
                                    {roleModalOpen && <RoleSelectModal handleAddDiscordRule={handleAddDiscordRule} handleClose={close} modalOpen={roleModalOpen} existingRoles={appliedRules[option_id] || []} />}
                                </>
                            }
                        </div>
                    </>
                }
            </div>

            {ruleError.id == option_id &&
                <div className="tab-message error" style={{ width: '100%' }}>
                    {element.gatekeeperType !== 'discord' && <p>Please enter a threshold</p>}
                    {element.gatekeeperType === 'discord' && <p>Selected roles cannot be left blank</p>}

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
        <div className="gatekeeper-toggle">
            <input checked={isGatekeeperOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle-${toggle_identifier}-${option_id}`} type="checkbox" />
            <label style={{ background: isGatekeeperOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle-${toggle_identifier}-${option_id}`}>
                <span className={`react-switch-button`} />
            </label>
        </div>
    )
}



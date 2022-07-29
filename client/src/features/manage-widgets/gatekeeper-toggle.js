import React, { useEffect, useState } from 'react'
import '../../css/gatekeeper-toggle.css'
import { useSelector } from 'react-redux';
import RoleSelectModal from './role-select-modal';


import {
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

function RuleSelect({ appliedRules, setAppliedRules, ruleError, setRuleError, toggle_identifier }) {
  // fetch available rules
  const availableRules = useSelector(selectDashboardRules);

  return (
    <div className="apply-gatekeeper-rules">
      {Object.entries(availableRules).map(([rule_id, value]) => {
        return (
          <GatekeeperRule ruleError={ruleError} key={rule_id} setRuleError={setRuleError} element={value} rule_id={rule_id} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier}/>
        )
      })}
    </div>
  )
}



function GatekeeperRule({ element, rule_id, appliedRules, setAppliedRules, ruleError, setRuleError, toggle_identifier}) {

  const [isGatekeeperOn, setIsGatekeeperOn] = useState(appliedRules[rule_id] != undefined)
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  const open = () => {
    setRoleModalOpen(true)
  }
  const close = (event, reason) => {
    if (reason && reason === 'backdropClick') return
    setRoleModalOpen(false)
  }


  useEffect(() => {
    setIsGatekeeperOn(appliedRules[rule_id] != undefined)

  }, [appliedRules])


  const addRule = (e) => {
    setAppliedRules({ type: 'update_single', payload: { [rule_id]: "" } })
    setRuleError({ [rule_id]: "" })
  }

  const deleteRule = () => {
    var objCopy = { ...appliedRules };
    delete objCopy[rule_id];
    setAppliedRules({ type: 'update_all', payload: objCopy })
  }

  const handleThresholdChange = (e) => {
    setAppliedRules({ type: 'update_single', payload: { [rule_id]: e.target.value } })
    setRuleError(false)
  }

  const handleAddDiscordRule = (val) => {

    setAppliedRules({ type: 'update_single', payload: { [rule_id]: val } })
  }

  return (
    <>
      <div className={'gk-rule ' + (ruleError.id == rule_id ? 'error' : 'undefined')}>
        {(element.type === 'erc721' || element.type === 'erc20') &&
          <>
            <p><b>Type:</b> <span className={element.type}>{element.type}</span></p>
            <p><b>Symbol: </b>
              <span onClick={() => { window.open('https://etherscan.io/address/' + element.type) }} className='gatekeeper-symbol'>{element.symbol}  <i className="fas fa-external-link-alt"></i></span>
            </p>
            <div className="toggle-flex">
              <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} rule_id={rule_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier}/>
              {isGatekeeperOn &&
                <>
                  <input type="number" value={appliedRules[rule_id]} placeholder="threshold" onChange={handleThresholdChange}></input>

                </>
              }
            </div>
          </>
        }
        {(element.type === 'discord') &&
          <>
            <p><b>Type:</b> <span className={element.type}>{element.type}</span></p>
            <p><b>Server:</b> {element.serverName}</p>
            <div className="toggle-flex">
              <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} rule_id={rule_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} toggle_identifier={toggle_identifier} />
              {isGatekeeperOn &&
                <>
                  <button className="select-roles primary-gradient-button" onClick={open}>select roles</button>
                  {roleModalOpen && <RoleSelectModal handleAddDiscordRule={handleAddDiscordRule} handleClose={close} modalOpen={roleModalOpen} existingRoles={appliedRules[rule_id] || []} />}
                </>
              }
            </div>
          </>
        }
      </div>

      {ruleError.id == rule_id &&
        <div className="tab-message error" style={{ width: '100%' }}>
          {element.type !== 'discord' && <p>Please enter a threshold</p>}
          {element.type === 'discord' && <p>Selected roles cannot be left blank</p>}

        </div>
      }
    </>
  )
}


function ToggleSwitch({ addRule, setRuleError, deleteRule, ruleError, rule_id, isGatekeeperOn, setIsGatekeeperOn, toggle_identifier }) {


  const handleToggle = () => {

    if (!isGatekeeperOn) {
      // gatekeeper just flipped on. Add it to applied rules
      addRule();
    }
    else {
      //  gatekeeper just flipped off delete it from applied rules
      deleteRule();
      if (ruleError.id === rule_id) {
        setRuleError({ [rule_id]: '' })
      }
    }
    setIsGatekeeperOn(!isGatekeeperOn)
  }




  return (
    <div className="gatekeeper-toggle">
      <input checked={isGatekeeperOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle-${toggle_identifier}-${rule_id}`} type="checkbox" />
      <label style={{ background: isGatekeeperOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle-${toggle_identifier}-${rule_id}`}>
        <span className={`react-switch-button`} />
      </label>
    </div>
  )
}


export { RuleSelect, GatekeeperRule, ToggleSwitch }
import React, { useEffect, useState, useRef } from 'react'
import '../../css/gatekeeper-toggle.css'
import { useSelector, useDispatch } from 'react-redux';
import RoleSelectModal from '../../helpers/modal/role-select-modal';


import {
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

function RuleSelect({ appliedRules, setAppliedRules, ruleError, setRuleError }) {
  // fetch available rules
  const availableRules = useSelector(selectDashboardRules);


  return (
    <div className="apply-gatekeeper-rules">
      {Object.entries(availableRules).map(([rule_id, value]) => {
        return (
          <GatekeeperRule ruleError={ruleError} setRuleError={setRuleError} element={value} rule_id={rule_id} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
        )
      })}
    </div>
  )
}



function GatekeeperRule({ element, rule_id, appliedRules, setAppliedRules, ruleError, setRuleError }) {

  const [isGatekeeperOn, setIsGatekeeperOn] = useState(appliedRules[rule_id] != undefined)
  const dispatch = useDispatch();
  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  const open = () => { setRoleModalOpen(true) }
  const close = () => { setRoleModalOpen(false) }


  const addressesEndRef = useRef(null);
  const gatekeeperErrorRef = useRef(null);

  const scrollToBottom = () => {
    addressesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToError = () => {
    gatekeeperErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  useEffect(() => {
    setIsGatekeeperOn(appliedRules[rule_id] != undefined)




    




  }, [appliedRules])


  const addRule = (e) => {
    //
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
      <div className="gk-rule">
        {(element.gatekeeperType === 'erc721' || element.gatekeeperType === 'erc20') &&
          <>
            <p><b>Type:</b> <span className={element.gatekeeperType}>{element.gatekeeperType}</span></p>
            <p><b>Symbol: </b>
              <span onClick={() => { window.open('https://etherscan.io/address/' + element.gatekeeperAddress) }} className='gatekeeper-symbol'>{element.gatekeeperSymbol}  <i className="fas fa-external-link-alt"></i></span>
            </p>
            <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} rule_id={rule_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
            {isGatekeeperOn &&
              <>
                <span>threshold</span>
                <input type="number" value={appliedRules[rule_id]} onChange={handleThresholdChange}></input>

              </>
            }
          </>
        }
        {(element.gatekeeperType === 'discord') &&
          <>
            <p><b>Type:</b> <span className={element.gatekeeperType}>{element.gatekeeperType}</span></p>
            <p><b>Server:</b> {element.serverName}</p>
            <ToggleSwitch setRuleError={setRuleError} ruleError={ruleError} addRule={addRule} deleteRule={deleteRule} rule_id={rule_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
            {isGatekeeperOn &&
              <>
                <span></span>
                <button className="select-roles primary-gradient-button" onClick={open}>select roles</button>
                {roleModalOpen && <RoleSelectModal handleAddDiscordRule={handleAddDiscordRule} handleClose={close} existingRoles={appliedRules[rule_id] || []} />}
              </>
            }
          </>
        }
      </div>

      {ruleError.id == rule_id &&
        <div className="tab-message error" style={{width: '100%'}}>
          {element.gatekeeperType !== 'discord' && <p>Please enter a threshold</p>}
          {element.gatekeeperType === 'discord' && <p>Selected roles cannot be left blank</p>}

        </div>
      }
    </>
  )
}


function ToggleSwitch({ addRule, setRuleError, deleteRule, ruleError, rule_id, isGatekeeperOn, setIsGatekeeperOn, appliedRules, setAppliedRules }) {


  const handleToggle = () => {

    if (!isGatekeeperOn) {
      // gatekeeper just flipped on. Add it to applied rules
      addRule();
    }
    else {
      //  gatekeeper just flipped off delete it from applied rules
      deleteRule();
      if(ruleError.id === rule_id){
        setRuleError({[rule_id]: ''})
      }
    }
    setIsGatekeeperOn(!isGatekeeperOn)
  }




  return (
    <div className="gatekeeper-toggle">
      <input checked={isGatekeeperOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle${rule_id}`} type="checkbox" />
      <label style={{ background: isGatekeeperOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle${rule_id}`}>
        <span className={`react-switch-button`} />
      </label>
    </div>
  )
}


export { RuleSelect, GatekeeperRule, ToggleSwitch }
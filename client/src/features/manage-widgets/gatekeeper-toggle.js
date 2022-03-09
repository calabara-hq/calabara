import React, { useEffect, useState, useRef } from 'react'
import '../../css/gatekeeper-toggle.css'
import { useSelector, useDispatch } from 'react-redux';


import {
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

function RuleSelect({ appliedRules, setAppliedRules, ruleError, setRuleError }) {
  // fetch available rules
  const availableRules = useSelector(selectDashboardRules);
  useEffect(() => { }, [appliedRules])



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
    //console.log(e.target.value)
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

  return (
    <>
      <div className="gk-rule">
        <p>Symbol: {element.gatekeeperSymbol}</p>
        <span style={{ color: "#555" }} className={'details rotate ' + (areDetailsVisible ? 'down' : undefined)} onClick={() => { setAreDetailsVisible(!areDetailsVisible) }}>details</span>
        <div className="gk-rule-input">
          <ToggleSwitch addRule={addRule} deleteRule={deleteRule} rule_id={rule_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
          {isGatekeeperOn &&
            <>
              <span>threshold</span>
              <input type="number" value={appliedRules[rule_id]} onChange={handleThresholdChange}></input>

            </>
          }
        </div>


      </div>
      {areDetailsVisible &&
        <div className="rule-details">
          <p>Type: {element.gatekeeperType}</p>
          <p className='detail-contract'>Contract: {element.gatekeeperAddress.substring(0, 6)}...{element.gatekeeperAddress.substring(38, 42)}</p>
          <p style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => { window.open('https://etherscan.io/address/' + element.gatekeeperAddress) }}><i class="fas fa-external-link-alt"></i></p>
        </div>
      }
      {ruleError.id == rule_id &&
        <div className="tab-message error">
          <p>Please enter a threshold</p>
        </div>
      }
    </>
  )
}


function ToggleSwitch({ addRule, deleteRule, rule_id, isGatekeeperOn, setIsGatekeeperOn, appliedRules, setAppliedRules }) {


  const handleToggle = () => {

    if (!isGatekeeperOn) {
      // gatekeeper just flipped on. Add it to applied rules
      console.log('on')
      addRule();
    }
    else {
      //  gatekeeper just flipped off delete it from applied rules
      deleteRule();
      console.log('off')
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
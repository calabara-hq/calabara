import React, { useState, useEffect, useRef, useReducer } from 'react'
import { motion } from "framer-motion"
import axios from 'axios'
import Backdrop from './modal-backdrop.js'
import Glyphicon from '@strongdm/glyphicon'

import { useSelector, useDispatch } from 'react-redux';

import {
  addToWikiList,
  selectWikiList,
  removeFromWikiList,
  renameWikiList,
} from '../../features/wiki/wiki-reducer';

import{
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';
import { useParams } from 'react-router-dom'

const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };



export default function HelpModal({ handleClose, tab, groupID }){
  // tab indicates which help tab we want to show
  const [infoTab, setInfoTab] = useState(false)
  const [saveVisible, setSaveVisible] = useState(false)
  const dispatch = useDispatch();








  async function handleSave(){
    console.log('saving')
  }



  return (
    <Backdrop>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="modal white-gradient"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"

        >
        <div className = "helpModalContainer">
        <button className="closeModalButton" onClick={handleClose}><Glyphicon glyph="remove"/></button>
        <div className = "helpModalContent">
        <HelpTab handleClose={handleClose} tab={tab} groupID={groupID}/>


        </div>
        </div>

        </motion.div>
    </Backdrop>
  );
}


function HelpTab({tab, handleClose, groupID}){

  return(
    <>

  {tab == 'deleteGatekeeper' && <DeleteGatekeeperTabContent handleClose={handleClose}/>}
  {tab == 'addWikiGrouping' && <AddWikiGrouping handleClose={handleClose} groupID={groupID}/>}

  </>
  )
}



function DeleteGatekeeperTabContent({handleClose}){
  const dispatch = useDispatch();
  return(
    <div className="infoContainer">
      <h1 style={{color: "white", fontSize: "25px"}}>This rule is currently applied to one or more of the dashboard widgets.</h1>
      <div className="infoContent">
      <p> Deleting it will remove the rule from the affected widgets, which may cause undesired side effects.</p>
      <div style={{width: "30%", float: "right", marginTop: "20px"}}>
      <button style={{marginRight: "10px",padding: "8px", backgroundColor: "#f2355c", color: "black", fontWeight: "bold", borderRadius: "10px", border: "none"}} onClick={() => {handleClose('delete')}}>Delete</button>
      <button style={{padding: "8px", backgroundColor: "lightgrey", color: "black", borderRadius: "10px", border: "none"}} onClick={() => {handleClose('cancel')}}>Cancel</button>

      </div>

      </div>
      </div>
  )
}

function AddWikiGrouping({handleClose, groupID}){

  // if groupID is null, we are creating a new folder. Otherwise we are updating an existing one.

  const wikiList = useSelector(selectWikiList)
  const [ruleError, setRuleError] = useState(false)
  const [progress, setProgress] = useState(0)
  const [groupingName, setGroupingName] = useState("");
  const dispatch = useDispatch();
  const [isFolderError, setIsFolderError] = useState(false);

  const [appliedRules, setAppliedRules] = useReducer(
    (appliedRules, newRules) => ({...appliedRules, ...newRules}),
     {}
  )

  useEffect(()=>{
    if(groupID != null){
      setAppliedRules(wikiList[groupID].gk_rules);
      setGroupingName(wikiList[groupID].group_name )
    }
  },[])

  useState(()=>{console.log(appliedRules)},[appliedRules])

  const {ens} = useParams();
  /*
  const handleNext = () => {
    // check if selected gatekeepers have a threshold value set
    for(const [key, value] of Object.entries(appliedRules)){
      if(value == ''){
        setRuleError({id: key})
        console.log('rule error on ', key)
      return;
      }
    }   
    setProgress(1)
  }
  */

  const handleNext = () => {
    // name error checking
    if(groupingName == ""){
      setIsFolderError(true)
    }
    else{
      setProgress(1);
    }
  }



  const handleSave = () => {
    // if there are no gatekeeper rules or name applied just close without doing anything    
    if(Object.keys(appliedRules).length == 0 && groupingName == ""){
      handleClose();
    }

    else{
      // check if there are any blank gatekeepers
      for(const [key, value] of Object.entries(appliedRules)){
        if(value == ""){
          setRuleError({id: key})
          return;
        }
      }

      if(groupID == null){
        // it's a new folder
      axios.post('/addWikiGrouping', {ens: ens, groupingName: groupingName, gk_rules: appliedRules}).then((response) => {
        dispatch(addToWikiList({group_id: response.data.group_id, 
                                value: {
                                  group_name: groupingName, 
                                  gk_rules: appliedRules, 
                                  list: []
                                }
                              }))
      });
    }
    else{
      // it's an update to existing folder
      axios.post('/updateWikiGrouping', {groupID: groupID, ens: ens, groupingName: groupingName, gk_rules: appliedRules}).then((response) => {
        dispatch(renameWikiList({group_id: groupID, 
                                value: {
                                  group_name: groupingName, 
                                  gk_rules: appliedRules, 
                                  list: wikiList[groupID].list
                                }
                              }))
      });
    }
      handleClose();
    }
  }
  
  const deleteGrouping = async() => {
    await axios.post('/deleteWikiGrouping', {ens: ens, groupID: groupID})
    dispatch(removeFromWikiList(groupID));
    handleClose(1);
  }

  return(
      <div className="newWikiGrouping">
      {progress == 0 && 
         <>
            <div className="newFolder">
              <div>
              <h2> Folder Name </h2>
              <input className={isFolderError ? 'error' : undefined}value={groupingName} onChange={(e) => {setGroupingName(e.target.value); setIsFolderError(false)}}></input>
              {isFolderError && 
                <div className="tab-error-msg">
                  <p>Please give your folder a name</p>
                </div>
              }
              </div>
          
              {groupID != null && 
              <div className="dangerzone">
                <div className="tab-dangerzone-msg">
                  <p>Danger Zone</p>
                </div>
                <div className="danger-contents">
                  <div className="danger-description">
                    <p>Delete folder</p>
                    <p>Deleting this folder will permanently delete all child documents</p>
                  </div>
                  <button onClick={deleteGrouping}> delete </button>
                </div>
              </div>
              }
            </div>
            <button className={"modal-next-btn " + (groupingName != '' ? 'enable' : 'disabled')} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>
            <button className={"modal-previous-btn"} onClick={handleClose}>cancel</button>
         </>

        }
        {progress == 1 && 
          <>
            <h2 className="tab-header"> Gatekeeper </h2>
            <div className="tab-message">
              <p>Toggle the switches to apply gatekeeper rules to this folder group. If multiple rules are applied, the gatekeeper will pass if the connected wallet passes any of the rules.</p>
            </div>
            <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>
            <button className={"modal-save-btn"} onClick={handleSave}>save</button>
            <button className={"modal-previous-btn"} onClick={()=>{setProgress(0)}}><i class="fas fa-long-arrow-alt-left"></i></button>
          </>
        }
        


      </div>
  )
}


function RuleSelect({appliedRules, setAppliedRules, ruleError, setRuleError}){
  // fetch available rules
  const availableRules = useSelector(selectDashboardRules);

  console.log(availableRules)


  return(
    <div className="apply-gatekeeper-rules">
      {Object.entries(availableRules).map(([rule_id, value]) => {
        return(
          <GatekeeperRule ruleError={ruleError} setRuleError={setRuleError} element={value} rule_id={rule_id} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>
        )
      })}
    </div>
  )
}


function GatekeeperRule({element, rule_id, appliedRules, setAppliedRules, ruleError, setRuleError}){
  console.log(element)
  const [isGatekeeperOn, setIsGatekeeperOn] = useState(appliedRules[rule_id] != undefined)

  const [areDetailsVisible, setAreDetailsVisible] = useState(false);

  const addRule = () => {
    setAppliedRules({[rule_id]: ""})
  }

  const deleteRule = () => {
    var objCopy = appliedRules;
    delete objCopy[rule_id];
    setAppliedRules(objCopy)
  }

  const handleThresholdChange = (e) => {
    setAppliedRules({[rule_id]: e.target.value})
    setRuleError(false)
  }

  return(
    <>
    <div className="gk-rule">
    <p>Symbol: {element.gatekeeperSymbol}</p>
    <span style={{color: "#555"}}className={'details rotate '+(areDetailsVisible ? 'down' : undefined)} onClick={() => {setAreDetailsVisible(!areDetailsVisible)}}>details</span>
    <ToggleSwitch addRule={addRule} deleteRule={deleteRule} rule_id={rule_id} isGatekeeperOn={isGatekeeperOn} setIsGatekeeperOn={setIsGatekeeperOn} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>
    {isGatekeeperOn && 

    <div className="gk-rule-input">
      <input type="number" value={appliedRules[rule_id]} onChange={handleThresholdChange}></input>
      {ruleError.id == rule_id &&
      <div style={{display: 'inline', position: 'absolute', width: 'fit-content'}} className="tab-error-msg">
          <p>Please enter a threshold</p>
        </div>
      }
    </div>
    }
    
    </div>
    {areDetailsVisible && 
      <div className="rule-details">
        <p>Type: {element.gatekeeperType}</p>
        <p className='detail-contract'>Contract: {element.gatekeeperAddress.substring(0,6)}...{element.gatekeeperAddress.substring(38,42)}</p>
        <p style={{fontSize: '16px', cursor: 'pointer'}} onClick={() => {window.open('https://etherscan.io/address/' + element.gatekeeperAddress)}}><i class="fas fa-external-link-alt"></i></p>
      </div>
    }
  </>
  )
}

function ToggleSwitch({addRule, deleteRule, rule_id, isGatekeeperOn, setIsGatekeeperOn}){

  

  const handleToggle = () => {

    if(!isGatekeeperOn){
      // gatekeeper just flipped on. Add it to applied rules
      addRule();
    }
    else{
      //  gatekeeper just flipped off delete it from applied rules
      deleteRule();
    }
    setIsGatekeeperOn(!isGatekeeperOn)
  }

  


  return(
    <div className="gatekeeper-toggle">
      <input checked={isGatekeeperOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle${rule_id}`} type="checkbox"/>
      <label  style={{ background: isGatekeeperOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle${rule_id}`}>
        <span className={`react-switch-button`} />
      </label>
    </div>
  )
}
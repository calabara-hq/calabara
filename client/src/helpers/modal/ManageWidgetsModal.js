import React, { useState, useEffect, useRef, useReducer } from 'react'
import { motion } from "framer-motion"
import axios from 'axios'
import Backdrop from './modal-backdrop.js'
import Glyphicon from '@strongdm/glyphicon'
import Tooltip from '@mui/material/Tooltip';
import calendarLogo from '../../img/calendar.svg'
import discordLogo from '../../img/discord.svg'
import snapshotLogo from '../../img/snapshot.svg'
import wikiLogo from '../../img/wiki.svg'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import {WidgetsCheckpointBar} from '../../features/checkpoint-bar/checkpoint-bar'
import {getSpace} from '../snapshot_api'
import ManageInstalledWidgetsTab from './update-installed-widgets.js'
import '../../css/modal.css';



import {
  setInstalledWidgets,
  setInstallableWidgets,
  populateInitialWidgets,
  selectInstalledWidgets,
  selectInstallableWidgets,
  populateVisibleWidgets,
  selectVisibleWidgets,
  updateWidgets,
} from '../../features/dashboard/dashboard-widgets-reducer';

import{
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

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



export default function ManageWidgetsModal({ handleClose }){
  // tab indicates which help tab we want to show
  const [functionality, setFunctionality] = useState(0)
  const [saveVisible, setSaveVisible] = useState(false)
  const dispatch = useDispatch();

  async function handleSave(){
    console.log('saving')
  }



  return (
    <Backdrop>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="modal"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"

        >
        <div className = "modalContainer">
        <button className="closeModalButton" onClick={handleClose}><Glyphicon glyph="remove"/></button>
        <div className = "modalContent">
        <FunctionalitySelect handleClose={handleClose} functionality={functionality} setFunctionality={setFunctionality}/>
        </div>
        </div>
        </motion.div>
    </Backdrop>
  );
}


function FunctionalitySelect({functionality, setFunctionality, handleClose}){


  return(
    <>
    {functionality == 0 && <ManageWidgetsEntrypoint setFunctionality={setFunctionality}/>}
    {functionality == 1 && <ManageInstalledWidgetsTab setFunctionality={setFunctionality}/>}
    {functionality == 2 && <AddNewWidgetsTab handleClose={handleClose} setFunctionality={setFunctionality}/>}

    </>
  )
}

function ManageWidgetsEntrypoint({setFunctionality}){

  const installedWidgets = useSelector(selectInstalledWidgets);
  const installableWidgets = useSelector(selectInstallableWidgets);

  return(
    <div className="entrypoint-container">
      {installedWidgets.length > 0 && 
        <div className="manage-installed" onClick={()=>{setFunctionality(1)}}>
            <h2>manage installed widgets</h2>
            <h2><Glyphicon glyph="cog"/></h2>
        </div>
      }
      {installableWidgets.length > 0 && 
        <div className="add-new" onClick={() => {setFunctionality(2)}}>
            <h2>install new widgets</h2>
            <h2><Glyphicon glyph="plus"/></h2>
        </div>
      }
    </div>

  )
}




function AddNewWidgetsTab({setFunctionality, handleClose}){
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState('');

  const [appliedRules, setAppliedRules] = useReducer(
    (appliedRules, newRules) => ({...appliedRules, ...newRules}),
    {}
  )

  const [metadata, setMetadata] = useReducer(
    (metadata, newMetadata) => ({...metadata, ...newMetadata}),
    {}
  )

  

  const switchProgress = () => {
    switch(progress){
      case 0:
        return(<SelectNewWidget setProgress={setProgress} selected={selected} setSelected={setSelected} setFunctionality={setFunctionality}/>)
      case 1:
        return(<ConfigureWidget setProgress={setProgress} selected={selected} metadata = {metadata} setMetadata={setMetadata}/>);
      case 2:
        return(<ConfigureGatekeeper setProgress={setProgress} selected={selected} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>);
      case 3:
        return(<FinalMessage setProgress={setProgress} selected={selected} appliedRules={appliedRules} metadata = {metadata} handleClose={handleClose}/>);
    }
  }






  return(
    <>
    {/*
    {progress == 0 && <h2 className="tab-header" style={{fontWeight: "bold"}}> &#x1F680; install new widgets </h2>}
    {progress == 1 && <h2 className="tab-header" style={{fontWeight: "bold"}}> {selected.name} setup </h2>}
    {progress == 2 && <h2 className="tab-header" style={{fontWeight: "bold"}}>  gatekeeper </h2>}
    {progress == 3 && <h2 className="tab-header" style={{fontWeight: "bold"}}> finalize </h2>}
    */}

    {progress == 0 && <SelectNewWidget setProgress={setProgress} selected={selected} setSelected={setSelected} setFunctionality={setFunctionality}/>}
    {progress == 1 && <ConfigureWidget setProgress={setProgress} selected={selected} metadata = {metadata} setMetadata={setMetadata}/>}
    {progress == 2 && <ConfigureGatekeeper setProgress={setProgress} selected={selected} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>}
    {progress == 3 && <FinalMessage setProgress={setProgress} selected={selected} appliedRules={appliedRules} metadata = {metadata} handleClose={handleClose}/>}

    </>
  )
}

function SelectNewWidget({setProgress, setSelected, selected, setFunctionality}){
  const installableWidgets = useSelector(selectInstallableWidgets);

  const handleNext = () => {
    if(selected.name == 'wiki'){
      // no additional setup. Go straight to finalize.
      setProgress(3);
    }
    else{
      if(selected != ''){
        setProgress(1);
      }
    }
  }

  return(
  <div className="install-new-tab">
    <h2 className="tab-header" style={{fontWeight: "bold"}}> &#x1F680; install new widgets </h2>
    <h2 className="tab-header">Select a widget to add to the dashboard</h2>
    <div className="installable-widgets-container">
    {installableWidgets.map((el, idx) => {
      return <InstallableWidget key={idx} el={el} selected={selected} setSelected={setSelected}/>
    })}
    </div>
    <button className={"modal-next-btn " + (selected != '' ? 'enable' : undefined )} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>
    <button className={"modal-previous-btn"} onClick={() => {setFunctionality(0)}}><i class="fas fa-long-arrow-alt-left"></i></button>

  </div>
  )
}




function ConfigureWidget({setProgress, selected, metadata, setMetadata}){
  return(
    <div className="configure-widget-tab">
      <h2 className="tab-header" style={{fontWeight: "bold"}}> {selected.name} setup </h2>
      {selected.name == 'snapshot' && <SnapshotConfiguration setProgress={setProgress}/>}
      {selected.name == 'calendar' && <CalendarConfiguration setProgress={setProgress} metadata={metadata} setMetadata={setMetadata}/>}
    </div>
  )
}

function ConfigureGatekeeper({setProgress, selected, appliedRules, setAppliedRules}){
  
  const [ruleError, setRuleError] = useState(false);
  const availableRules = useSelector(selectDashboardRules);

  const handleNext = () => {
    // check if selected gatekeepers have a threshold value set
    for(const [key, value] of Object.entries(appliedRules)){
      if(value == ''){
        setRuleError({id: key})
        console.log('rule error on ', key)
      return;
      }
    }
    
    setProgress(3)
   
  }

  return(
    <div className="configure-gatekeeper-tab">
      <h2 className="tab-header" style={{fontWeight: "bold"}}>  gatekeeper </h2>
       {Object.keys(availableRules).length == 0 ?
        <div className="tab-neutral-message" style={{marginTop: '150px'}}>
          <p>Nothing to do. There are no gatekeepers configured for this organization. Gatekeepers can be added in organization settings.</p>
        </div>
      :
        <>
        <div className="tab-neutral-message">
          <p>Toggle the switches to apply gatekeeper rules to this widget. If multiple rules are applied, the gatekeeper will pass if the connected wallet passes any of the rules.</p>
        </div>
        <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>
        </> 
    }
      
     
      <button className={"modal-previous-btn"} onClick={() => {setProgress(1)}}><i class="fas fa-long-arrow-alt-left"></i></button>
      <button className={"modal-next-btn enable"} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>

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
    console.log(appliedRules)
    var objCopy = appliedRules;
    delete objCopy[rule_id];
    console.log(objCopy)
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
      <div className="tab-error-msg">
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

function ToggleSwitch({addRule, deleteRule, rule_id, isGatekeeperOn, setIsGatekeeperOn, appliedRules, setAppliedRules}){

  

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


function FinalMessage({setProgress, selected, appliedRules, metadata, handleClose}){

  const {ens} = useParams();
  const dispatch = useDispatch();
  const availableRules = useSelector(selectDashboardRules);


  const finalize = async() => {
 
  const req = axios.post( '/addWidget', {ens: ens, name: selected.name, metadata: metadata, gatekeeper_rules: appliedRules})
  
  dispatch(updateWidgets(1, {ens: ens, name: selected.name, metadata: metadata, gatekeeper_rules: appliedRules, notify: 0}))
 
  handleClose();
 
  }

  const handlePrevious = () =>{
    if(selected.name == 'wiki'){
      setProgress(0);
    }

    else{setProgress(2)}
  }


  return(
   <> 
    <div className="final-message-tab">
      <h1>🎉🎉🎉</h1>
      <h2>That was easy. Click <b>finish</b> to add {selected.name} to the dashboard.</h2>
      <button className={"modal-previous-btn"} onClick={handlePrevious}><i class="fas fa-long-arrow-alt-left"></i></button>
    </div>
    <button className={"modal-next-btn enable"} onClick={finalize}>Finish</button>
  </>
  )
}



function SnapshotConfiguration({setProgress}){
  const {ens} = useParams();
  const [isLoading, setIsLoading] = useState(true)
  const [doesSpaceExist, setDoesSpaceExist] = useState(false)

  setTimeout(()=>{
      setIsLoading(false);
  },3000)

  useEffect(() => {
    (async()=>{
      const res = await getSpace(ens);
      console.log(res)
      if(res != null){
        setDoesSpaceExist(true)
        setIsLoading(false)
      }
    })();
  },[])

  console.log(doesSpaceExist)

  return(
    <>
    {!isLoading && 
      <>
        {doesSpaceExist && 
          <div className="tab-success-msg">
            <p style={{textAlign: 'center'}}> Successfully found the snapshot space for {ens} &#x1F517;</p>
          </div>
        }
        {!doesSpaceExist &&
        <div className="tab-error-msg" style={{width: '60%', textAlign: 'center'}}>
          <p>Couldn't find a space for this ens. To add this widget, a snapshot space with ens {ens} must exist.</p>
        </div>
        }
      </>
    }
    {isLoading && 
     <div className="tab-neutral-message">
      <p>searching for the {ens} snapshot space</p>
    </div>    
    }
    {doesSpaceExist && <button className={"modal-next-btn " + (doesSpaceExist ? 'enable' : 'disabled')} onClick={() => {setProgress(2)}}><i class="fas fa-long-arrow-alt-right"></i></button>}
    <button className={"modal-previous-btn"} onClick={() => {setProgress(0)}}><i class="fas fa-long-arrow-alt-left"></i></button>
    </>
  )
}

function CalendarConfiguration({setProgress, progress, metadata, setMetadata}){
  const [configProgress, setConfigProgress] = useState(0)
  const [inputError, setInputError] = useState(0);
  const [calendarID, setCalendarID] = useState(metadata.calendarID || "")
  const [copyStatus, setCopyStatus] = useState('copy to clipboard')

  const numSteps = 2;


  // first step in adding the calendar.
  // for google calendar, we use a service account to access a calendar instance.
  // if the calendar is public, fetchCalendarMetaData will return OK and we can immediately start interfacing with the calendar
  // if fetchCalendarMetaData returned FAIL, 1 of 2 things happened...
  // either
  // 1. the calendar is not public
  // 2. user error on calendarID input
  // googles calendar api gives the same response in both cases. (pending further analysis)
  // in both cases, we'll render a 'Step 2' section which allows the user to add our service account to their calendar.
  // if they do this, then fetchCalendarMetaData should now return true.
  // if they do this and fetchCalendarMetaData returns FAIL still, then they probably typed it in wrong.

  const updateCalendarID = (e) =>{
    if(inputError == 1){
      setInputError(0)
    }
    setCalendarID(e.target.value)
  }

  async function submitCalendarID(){
    var result = await axios.post('/fetchCalendarMetaData', {calendarID: calendarID})
    if(result.data == 'FAIL'){
      return 'fail'
    }
    else{
      return 'success'
    }
  }

  async function testGrantedAccess(){
    var result = await axios.post('/fetchCalendarMetaData', {calendarID: calendarID})
    console.log(result)
    if(result.data == 'FAIL'){
      //fadeStatus(-1);
      //setProgress(1);
      return 'fail'
    }
    else{
      //fadeStatus(1);
      //setProgress(3);
      return 'success'
    }
  }


  function copyToClipboard(){
    navigator.clipboard.writeText('calabara-service-account@calabara-331416.iam.gserviceaccount.com')
    setCopyStatus('copied!')
    setTimeout(()=>{setCopyStatus('copy to clipboard')}, 1000)
  }


  async function handleNext(){
      if(configProgress == 0){
        // check if we got any input from the calendar ID field
        // if there is no input, set an error.
        // else, check the calendar ID.

          const res = await submitCalendarID();
          if(res == 'success'){
            // found the calendar and we can advance out of this inner loop
            setMetadata({calendarID: calendarID})
            setProgress(2)
          }
          else{
            // the calendar is not public, ask them to set it to public
            setConfigProgress(1);
          }
      }

      else if(configProgress == 1){

        const res = await testGrantedAccess();
        if(res == 'fail'){
          setConfigProgress(0);
          setInputError(1);
        }
        else if(res == 'success'){
          // increase the outer loop
          setProgress(2)
        }


      }

    }

  function handlePrevious(){
    if(configProgress ==  1){
      setConfigProgress(0);
    }
    else{
      setProgress(0)
    }
  }



  return(
    <>

      {configProgress == 0 &&
        

        <div className="calendar-step1">
          <div className="tab-message">
           <p>Locate the calendar ID for your organization. <u onClick={() => {window.open('https://docs.calabara.com/v1/widgets/calendar-description#integrating-google-calendar')}}>Learn more.</u></p>
          </div>
          <br/><br/>
          <p> 1. Open google calendar settings and scroll down to the <strong> Integrate calendar </strong> section</p>
          <p> 2. Copy the Calendar ID for your organization and paste it in the field below.</p>
          <p> ** Note: Chrome browsers have a tendency to copy more than just the calendarID</p>
          <div className="calendar-step1-input" style={{marginLeft: "20px"}}>
            <h3> calendar id</h3>
            {inputError == 1 && <p className="step1InputError"> This doesn't seem like a valid calendar ID. </p>}
            <input className={"cal-id-input " + (inputError == 1 ? 'calIdError' : '')} placeholder="xxxxyyyyzzzz@group.calendar.google.com" onChange={updateCalendarID} value={calendarID}/>
          </div>
        </div>
    
      }
      {configProgress == 1 &&
        <div className="calendar-step2">
          <div className="tab-message">
            <p>It seems that your organizations calendar is not public. That's OK. You will just have to give us access.</p>
          </div>
        <br/><br/>
        <p> 1. Copy our service account address below</p>
        <br/>
        <Tooltip title={<h1>{copyStatus}</h1>} arrow>
        <pre onClick={copyToClipboard}>calabara-service-account@calabara-331416.iam.gserviceaccount.com</pre>
        </Tooltip>
        <br/>
        <p> 2. Open the calendar settings again, and find the section near the top titled <strong>Share with specific people.</strong></p>
        <p> 3. Select <strong>Add people</strong> and paste our account address in the field. Please set the permissions to <strong>See all event details.</strong></p>
        <p> 4. Click next.</p>
        </div>
      }

      <button className={"modal-next-btn " + (calendarID == '' ? 'disabled' : 'enable')} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>
      <button className={"modal-previous-btn"} onClick={handlePrevious}><i class="fas fa-long-arrow-alt-left"></i></button>
      </>
  )
}


function InstallableWidget({el, selected, setSelected}){
  let imgSource, description, link

  if(el.name == 'snapshot'){
    imgSource = snapshotLogo
    description = 'Help members stay up to date on proposals'
    link = 'https://docs.calabara.com/v1/widgets/snapshot-description';
  }
  if(el.name == 'wiki'){
    imgSource = wikiLogo
    description = 'Token-gate documents and updates'
    link = 'https://docs.calabara.com/v1/widgets/docs-description'

  }
  if(el.name == 'calendar'){
    imgSource = calendarLogo
    description = 'Integrate a google calendar'
    link = 'https://docs.calabara.com/v1/widgets/calendar-description'
  }

  const handleClick = () => {
    if (selected.name == el.name){
      setSelected('')
    }
    else{
      setSelected(el)
    }
  }

  return(

     <div className={"installable-widget " + (selected.name == el.name ? 'selected' : '')} onClick={handleClick}>
     <img src={imgSource}/>
       <div className="installable-widget-text">
       <p>{el.name == 'wiki' ? 'docs' : el.name}</p>
       <p>{description}</p>
       <u onClick={() => {window.open(link)}}>Learn more</u>
       </div>
     </div>
  )
}




import React, {useEffect, useState, useReducer, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import calendarLogo from '../../img/calendar.svg'
import snapshotLogo from '../../img/snapshot.svg'
import wikiLogo from '../../img/wiki.svg'
import axios from 'axios'
import { Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';

import {
    setInstalledWidgets,
    setInstallableWidgets,
    populateInitialWidgets,
    selectInstalledWidgets,
    selectInstallableWidgets,
    populateVisibleWidgets,
    selectVisibleWidgets,
    updateWidgets,
    updateWidgetMetadata,
    updateWidgetGatekeeper,
  } from '../../features/dashboard/dashboard-widgets-reducer';
  
  import{
    selectDashboardRules,
  } from '../../features/gatekeeper/gatekeeper-rules-reducer';





  export default function ManageInstalledWidgetsTab({setFunctionality}){
    const installedWidgets = useSelector(selectInstalledWidgets)
    const [selected, setSelected] = useState('')
    const [progress, setProgress] = useState(0);
  
    useEffect(()=>{

    },[progress])


    // handle updates to metadata or gatekeeper settings
    useEffect(() => {
      if(progress == 1){
        for (const [key, value] of Object.entries(installedWidgets)){
          if(value.name == selected.name){
            setSelected(value)
          }
        }
      }
    },[installedWidgets])
  
    return(
      <>
      {progress == 0 && <SelectInstalledWidget setProgress={setProgress} selected={selected} setSelected={setSelected} setFunctionality={setFunctionality}/>}
      {progress == 1 && <ManageWidget setProgress={setProgress} selected={selected}/>}
      </>
    )
  }

  function SelectInstalledWidget({setProgress, setSelected, selected, setFunctionality}){
    const installedWidgets = useSelector(selectInstalledWidgets);


    const handleNext = () => {
      if(selected != ''){
        setProgress(1);
      }
    }

    return(
      <div className="manage-installed-tab">
        <h2 className="tab-header" style={{fontWeight: 'bold'}}> manage installed widgets</h2>

          <h2 className="tab-header"> Select a widget you would like to manage</h2>
          <div className="installable-widgets-container">
            {installedWidgets.map((el) => {
              return <InstalledWidget el={el} selected={selected} setSelected={setSelected}/>
            })}
          </div>
          <button className={"modal-next-btn " + (selected.name != '' ? 'enable' : undefined)} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>
          <button className="modal-previous-btn" onClick={() => {setFunctionality(0)}}><i class="fas fa-long-arrow-alt-left"></i></button>
      </div>
    )
  }

  
  function InstalledWidget({el, selected, setSelected}){
    let imgSource, description, link

    const handleClick = () => {
      if (selected.name == el.name){
        setSelected('')
      }
      else{
        setSelected(el)
      }
    }


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
  

  function ManageWidget({selected, setProgress}){
    
    // show 2 divs: gatekeeper settings and metadata settings (if applicable). 
    // only calendar will have metadata for now
    // show delete button as well

    
    const [settingsStep, setSettingsStep] = useState(0);


    return(
        <>
            {settingsStep == 0 &&
                <WidgetSummary selected={selected} setSettingsStep={setSettingsStep} setProgress={setProgress}/>
            }
            {settingsStep == 1 && 
                <MetadataSettings selected={selected} setSettingsStep={setSettingsStep}/>
            }
            {settingsStep == 2 && 
                <GatekeeperSettings selected={selected} setSettingsStep={setSettingsStep}/>
            }
        </>
    )
  }

  function WidgetSummary({selected, setSettingsStep, setProgress}){

    const [metadataExists, setMetadataExists] = useState(false);
    const dispatch = useDispatch();

    const {ens} = useParams();

    useEffect(()=>{
        if(Object.keys(selected.metadata).length > 0){
            setMetadataExists(true)
        }
    })

      const deleteWidget = async() => {
        dispatch(updateWidgets(0, selected));
        await axios.post('/removeWidget', {ens: ens, name: selected.name})
        setProgress(0);
      }

      return(
        <div className='widget-summary'>
          <div>
            <h2 style={{textAlign: "left"}}>{selected.name} settings</h2>
            <img src={'/img/' + selected.name + '.svg'}></img>
        </div>
        <div className="updateable-settings-container">
          <div className="standard-contents">
            {metadataExists && 
            <>
              <div className="standard-description">
                <p>Metadata</p>
                <p>Manage hooks to Google calendar.</p>
              </div>
              <button onClick={() => {setSettingsStep(1)}}>modify</button>
            </>
            }
          </div>
          <div className="standard-contents">
            {selected.name != 'wiki' && 
            <>
              <div className="standard-description">
                <p>Gatekeeper</p>
                <p>Manage gatekeeper rules applied to this widget.</p>
              </div>
              <button onClick={() => {setSettingsStep(2)}}>modify</button>
            </>
            }
          </div>
            <div className="dangerzone">
                <div className="tab-dangerzone-msg">
                  <p>Danger Zone</p>
                </div>
                <div className="danger-contents">
                  <div className="danger-description">
                    <p>Delete {selected.name}</p>
                    <p>Deleting {selected.name} will permanently delete all of its data.</p>
                  </div>
                  <button onClick={deleteWidget}> delete </button>
                </div>
        </div>
        </div>
        <button className="modal-previous-btn" onClick={() => {setProgress(0)}}><i class="fas fa-long-arrow-alt-left"></i></button>
        </div>
      )
  }


  function MetadataSettings({selected, setSettingsStep}){
    const [metadata, setMetadata] = useReducer(
      (metadata, newMetadata) => ({...metadata, ...newMetadata}),
      selected.metadata
    )
   
    return(
      <>
        <div className="update-metadata-settings">
          <h2>{selected.name} metadata</h2>
          <div className="metadata">
            <CalendarConfiguration metadata={metadata} setMetadata={setMetadata} setSettingsStep={setSettingsStep}/>
          </div>
        </div>
        <button className="modal-previous-btn" onClick={() => {setSettingsStep(0)}}><i class="fas fa-long-arrow-alt-left"></i></button>
      </>
    )
  }

  function CalendarConfiguration({metadata, setMetadata, setSettingsStep}){
    const [configProgress, setConfigProgress] = useState(0)
    const [inputError, setInputError] = useState(0);
    const [calendarID, setCalendarID] = useState(metadata.calendarID || "")
    const [copyStatus, setCopyStatus] = useState('copy to clipboard');
    const {ens} = useParams();
    const dispatch = useDispatch();
  
    const numSteps = 2;
  
  
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
        return 'fail'
      }
      else{
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
              setMetadata({calendarID: calendarID});
              await axios.post('/updateWidgetMetadata', {ens: ens, metadata: {calendarID: calendarID}, name: 'calendar'});
              dispatch(updateWidgetMetadata('calendar', {calendarID: calendarID}))
              setSettingsStep(0);
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
            setMetadata({calendarID: calendarID});
            await axios.post('/updateWidgetMetadata', {ens: ens, metadata: {calendarID: calendarID}, name: 'calendar'});
            dispatch(updateWidgetMetadata('calendar', {calendarID: calendarID}))
            setSettingsStep(0);
          }
  
  
        }
  
      }
  
    function handlePrevious(){
      if(configProgress ==  1){
        setConfigProgress(0);
      }
      else{
        //setProgress(0)
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
  


  function GatekeeperSettings({selected, setSettingsStep}){
     
    const [ruleError, setRuleError] = useState('');
    const {ens} = useParams();
    const dispatch = useDispatch();

    function reducer(state, action){
        switch(action.type){
            case 'update_single':
                return {...state, ...action.payload};
            case 'update_all':
                return {...action.payload}
            default: 
                throw new Error();
        }
    }
    const [appliedRules, setAppliedRules] = useReducer(reducer, selected.gatekeeper_rules);

    const handlePrevious = () => {
      // check if selected gatekeepers have a threshold value set
      for(const [key, value] of Object.entries(appliedRules)){
        if(value == ''){
          setRuleError({id: key})
          console.log('rule error on ', key)
        return;
        }
      }
      setSettingsStep(0);
    }


  const handleSave = async() => {
    await axios.post('/updateWidgetGatekeeperRules', {ens: ens, gk_rules: appliedRules, name: selected.name});
    dispatch(updateWidgetGatekeeper(selected.name, appliedRules))
    setSettingsStep(0);
  }


  return(
    <div className="configure-gatekeeper-tab">
      <h2 className="tab-header"> gatekeeper </h2>
      <div className="tab-message">
          <p>Toggle the switches to apply gatekeeper rules to this widget. If multiple rules are applied, the gatekeeper will pass if the connected wallet passes any of the rules. <u onClick={() => {window.open('https://docs.calabara.com/gatekeeper')}}>Learn more</u></p>
      </div>
      <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>
      <button className="modal-save-btn" onClick={handleSave}>Save</button>
      <button className="modal-previous-btn" onClick={handlePrevious}><i class="fas fa-long-arrow-alt-left"></i></button>
    </div>
  )
    
  }



  function RuleSelect({appliedRules, setAppliedRules, ruleError, setRuleError}){
    // fetch available rules
    const availableRules = useSelector(selectDashboardRules);
    useEffect(()=>{},[appliedRules])

  
  
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

    const [isGatekeeperOn, setIsGatekeeperOn] = useState(appliedRules[rule_id] != undefined)
    const dispatch = useDispatch();
    const [areDetailsVisible, setAreDetailsVisible] = useState(false);

    const addressesEndRef = useRef(null);
    const gatekeeperErrorRef = useRef(null);
  
    const scrollToBottom = () => {
      addressesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    const scrollToError = () => {
      gatekeeperErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "end"})
    }

    useEffect(()=>{
        setIsGatekeeperOn(appliedRules[rule_id] != undefined)
    },[appliedRules])


    const addRule = (e) => {
        //console.log(e.target.value)
      setAppliedRules({type: 'update_single', payload: {[rule_id]: ""}})
      setRuleError({[rule_id]: ""})
    }
  
    const deleteRule = () => {
      var objCopy = {...appliedRules};
      delete objCopy[rule_id];
      console.log(objCopy)
      setAppliedRules({type: 'update_all', payload: objCopy})
    }
  
    const handleThresholdChange = (e) => {
      setAppliedRules({type: 'update_single', payload: {[rule_id]: e.target.value}})
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

  
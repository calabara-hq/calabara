import React, { useState, useEffect, useRef, useReducer } from 'react'
import axios from 'axios'
import Glyphicon from '@strongdm/glyphicon'
import { SettingsCheckpointBar, FinalizeSettingsCheckpointBar } from '../../features/checkpoint-bar/checkpoint-bar'
import Wallet, { validAddress, erc20GetSymbolAndDecimal, erc721GetSymbol, signTransaction, connectWallet } from '../../features//wallet/wallet'
import * as WebWorker from '../../app/worker-client';
import { useHistory, useParams } from 'react-router-dom'
import HelpModal from '../../helpers/modal/helpModal'
import '../../css/manage-widgets.css'
import snapshotLogo from '../../img/snapshot.svg'
import wikiLogo from '../../img/wiki.svg'
import calendarLogo from '../../img/calendar.svg'
import ManageInstalledWidgetsTab from './update-installed-widgets.js'

import { useSelector, useDispatch } from 'react-redux';

import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../../features/wallet/wallet-reducer';

import {
  selectDashboardInfo, 
  updateDashboardInfo,
  populateDashboardInfo,
} from '../../features/dashboard/dashboard-info-reducer';
import { useForkRef } from '@mui/material'

import {
  populateDashboardRules,
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

import {
  selectInstalledWidgets,
  selectInstallableWidgets,
} from '../../features/dashboard/dashboard-widgets-reducer';



export default function ManageWidgets(){
  const [functionality, setFunctionality] = useState(0)
  const [saveVisible, setSaveVisible] = useState(false)
  const dispatch = useDispatch();

  async function handleSave(){
    console.log('saving')
  }



  return (
        <div className = "manage-widgets-container">
        <FunctionalitySelect functionality={functionality} setFunctionality={setFunctionality}/>
        </div>
  );
}

function FunctionalitySelect({functionality, setFunctionality}){


    return(
      <>
      {functionality == 0 && <ManageWidgetsEntrypoint setFunctionality={setFunctionality}/>}
      {functionality == 1 && <ManageInstalledWidgetsTab setFunctionality={setFunctionality}/>}
      {/*
      {functionality == 2 && <AddNewWidgetsTab handleClose={handleClose} setFunctionality={setFunctionality}/>}
      */}
      </>
    )
  }


  function ManageWidgetsEntrypoint({setFunctionality}){

    const installedWidgets = useSelector(selectInstalledWidgets);
    const installableWidgets = useSelector(selectInstallableWidgets);
  
    return(
      <div className="manage-widgets-content">
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


  function AddNewWidgetsTab({setFunctionality}){
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
  
    
  
  
  
  
  
    return(
      <>
      {progress == 0 && <SelectNewWidget setProgress={setProgress} selected={selected} setSelected={setSelected} setFunctionality={setFunctionality}/>}
      {/*
      {progress == 1 && <ConfigureWidget setProgress={setProgress} selected={selected} metadata = {metadata} setMetadata={setMetadata}/>}
      {progress == 2 && <ConfigureGatekeeper setProgress={setProgress} selected={selected} appliedRules={appliedRules} setAppliedRules={setAppliedRules}/>}
      {progress == 3 && <FinalMessage setProgress={setProgress} selected={selected} appliedRules={appliedRules} metadata = {metadata}/>}
      */}
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
  
  
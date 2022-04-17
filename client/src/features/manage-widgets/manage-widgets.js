import React, { useState, useEffect, useRef, useReducer } from 'react'
import axios from 'axios'
import Glyphicon from '@strongdm/glyphicon'
import { SettingsCheckpointBar, FinalizeSettingsCheckpointBar } from '../../features/checkpoint-bar/checkpoint-bar'
import Wallet, { validAddress, erc20GetSymbolAndDecimal, erc721GetSymbol, signTransaction, connectWallet } from '../../features//wallet/wallet'
import * as WebWorker from '../../app/worker-client';
import { useHistory, useParams } from 'react-router-dom'
import HelpModal from '../../helpers/modal/helpModal'
import '../../css/manage-widgets.css'
import '../../css/settings-buttons.css'
import '../../css/status-messages.css'
import snapshotLogo from '../../img/snapshot.svg'
import wikiLogo from '../../img/wiki.svg'
import calendarLogo from '../../img/calendar.svg'
import ManageInstalledWidgetsTab from './update-installed-widgets.js'
import CalendarConfiguration from './calendar-configuration'
import SnapshotConfiguration from './snapshot-configuration'
import { RuleSelect } from './gatekeeper-toggle';
import { showNotification } from '../notifications/notifications'



import { useSelector, useDispatch } from 'react-redux';


import {
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

import {
  selectInstalledWidgets,
  selectInstallableWidgets,
  updateWidgets,
} from '../../features/dashboard/dashboard-widgets-reducer';



export default function ManageWidgets() {
  const [functionality, setFunctionality] = useState(0)
  const [saveVisible, setSaveVisible] = useState(false)
  const [tabHeader, setTabHeader] = useState('manage apps')
  const dispatch = useDispatch();
  const history = useHistory();
  const {ens} = useParams();

  // don't allow direct URL access
  const checkHistory = () => {
    if(history.action === 'POP'){
        history.push('/' + ens + '/dashboard')
    }
  }



  useEffect(()=>{
    checkHistory();
  },[])

  return (
    <div className="manage-widgets-container">
      <div className="manage-widgets-top-level">
        <p className="left"></p>
        <p>{tabHeader}</p>
        <div className="right">
          <button className="exit-btn" onClick={() => { history.push('dashboard') }}>exit</button>
        </div>
      </div>
      <FunctionalitySelect functionality={functionality} setFunctionality={setFunctionality} setTabHeader={setTabHeader} />
    </div>
  );
}

function FunctionalitySelect({ functionality, setFunctionality, setTabHeader }) {


  return (
    <>
      {functionality == 0 && <ManageWidgetsEntrypoint setFunctionality={setFunctionality} setTabHeader={setTabHeader} />}
      {functionality == 1 && <ManageInstalledWidgetsTab setFunctionality={setFunctionality} setTabHeader={setTabHeader} />}
      {functionality == 2 && <AddNewWidgetsTab setFunctionality={setFunctionality} setTabHeader={setTabHeader} />}
    </>
  )
}


function ManageWidgetsEntrypoint({ setFunctionality, setTabHeader }) {
  useEffect(() => {
    setTabHeader('manage apps')
  }, [])

  const installedWidgets = useSelector(selectInstalledWidgets);
  const installableWidgets = useSelector(selectInstallableWidgets);

  return (
    <div className="manage-widgets-content">
      {installedWidgets.length > 0 &&
        <div className="manage-installed" onClick={() => { setFunctionality(1) }}>
          <h2>manage installed apps</h2>
          <h2><Glyphicon glyph="cog" /></h2>
        </div>
      }
      {installableWidgets.length > 0 &&
        <div className="add-new-widget" onClick={() => { setFunctionality(2) }}>
          <h2>install new apps</h2>
          <h2><Glyphicon glyph="plus" /></h2>
        </div>
      }
    </div>

  )
}


function AddNewWidgetsTab({ setFunctionality, setTabHeader }) {
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState('');


  function reducer(state, action) {
    switch (action.type) {
      case 'update_single':
        return { ...state, ...action.payload };
      case 'update_all':
        return { ...action.payload }
      default:
        throw new Error();
    }
  }
  const [appliedRules, setAppliedRules] = useReducer(reducer, {});


  const [metadata, setMetadata] = useReducer(
    (metadata, newMetadata) => ({ ...metadata, ...newMetadata }),
    {}
  )




  return (
    <>
      {progress == 0 && <SelectNewWidget setProgress={setProgress} selected={selected} setSelected={setSelected} setFunctionality={setFunctionality} setTabHeader={setTabHeader} />}
      {progress == 1 && <ConfigureWidget setProgress={setProgress} selected={selected} metadata={metadata} setMetadata={setMetadata} setTabHeader={setTabHeader} />}
      {progress == 2 && <ConfigureGatekeeper setProgress={setProgress} selected={selected} appliedRules={appliedRules} setAppliedRules={setAppliedRules} setTabHeader={setTabHeader} />}
      {progress == 3 && <FinalMessage setProgress={setProgress} selected={selected} setSelected={setSelected} appliedRules={appliedRules} metadata={metadata} setTabHeader={setTabHeader} />}
    </>
  )
}


function SelectNewWidget({ setProgress, setSelected, selected, setFunctionality, setTabHeader }) {
  const installableWidgets = useSelector(selectInstallableWidgets);

  useEffect(() => {
    setTabHeader('install new apps')
    setSelected('')
  }, [])



  useEffect(() => {

    if (selected.name == 'wiki') {
      // no additional setup. Go straight to finalize.
      setProgress(3);
    }
    else if (selected != '') {
      setProgress(1);
    }
  }, [selected])

  return (
    <div className="install-new-tab">
      <div className="tab-message neutral">
        <p>Select an app to add to the dashboard</p>
      </div>
      <div className="installable-widgets-container">
        {installableWidgets.map((el, idx) => {
          return <InstallableWidget key={idx} el={el} selected={selected} setSelected={setSelected} />
        })}
      </div>
      <div className="manage-widgets-next-previous-ctr">
        <button className={"previous-btn"} onClick={() => { setFunctionality(0) }}><i class="fas fa-long-arrow-alt-left"></i></button>
      </div>
    </div>
  )
}

function ConfigureWidget({ setProgress, selected, metadata, setMetadata, setTabHeader }) {

  useEffect(() => {
    if (selected == '') {
      setProgress(0)
    }
  }, [])

  return (
    <div className="configure-widget-tab">
      {selected.name == 'snapshot' && <SnapshotConfiguration setProgress={setProgress} setTabHeader={setTabHeader} />}
      {selected.name == 'calendar' && <CalendarConfiguration mode={'new'} setProgress={setProgress} metadata={metadata} setMetadata={setMetadata} setTabHeader={setTabHeader} />}
    </div>
  )
}
function ConfigureGatekeeper({ setProgress, selected, appliedRules, setAppliedRules, setTabHeader }) {

  const [ruleError, setRuleError] = useState(false);
  const availableRules = useSelector(selectDashboardRules);




  useEffect(() => {
    setTabHeader('gatekeeper')
  }, [])

  const handleNext = () => {
    // check if selected gatekeepers have a threshold value set
    for (const [key, value] of Object.entries(appliedRules)) {
      if (value == '') {
        setRuleError({ id: key })
        return;
      }
    }
    setProgress(3)

  }

  return (
    <div className="manage-widgets-configure-gatekeeper-tab">
      {Object.keys(availableRules).length == 0 ?
        <div className="tab-message neutral">
          <p>Nothing to do. There are no gatekeepers configured for this organization. Gatekeepers can be added in organization settings.</p>
        </div>
        :
        <>
          <div className="tab-message neutral">
            <p>Toggle the switches to apply gatekeeper rules to this app. If multiple rules are applied, the gatekeeper will pass if the connected wallet passes 1 or more rules.</p>
          </div>
          <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
        </>
      }

      <div className="manage-widgets-next-previous-ctr">
        <button className={"previous-btn"} onClick={() => { setProgress(1); }}><i class="fas fa-long-arrow-alt-left"></i></button>
        <button className={"next-btn enable"} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>
      </div>

    </div>
  )
}






function FinalMessage({ setProgress, selected, appliedRules, metadata, setSelected, setTabHeader }) {

  const { ens } = useParams();
  const dispatch = useDispatch();
  const availableRules = useSelector(selectDashboardRules);
  const history = useHistory()

  useEffect(() => {
    setTabHeader('')
  }, [])

  const finalize = async () => {

    const req = axios.post('/addWidget', { ens: ens, name: selected.name, metadata: metadata, gatekeeper_rules: appliedRules })

    showNotification('saved successfully', 'success', 'successfully added application')
    dispatch(updateWidgets(1, { ens: ens, name: selected.name, metadata: metadata, gatekeeper_rules: appliedRules, notify: 0 }))
    history.push('dashboard')
  }

  const handlePrevious = () => {
    
    if (selected.name == 'wiki') {
      setSelected('')
      setProgress(0);
    }

    else { setProgress(2) }
  }


  return (
    <div className="manage-widgets-final-message-tab">
      <div>
        <h1>🎉🎉🎉</h1>
        <h2>That was easy. Click <b>finish</b> to add {(selected.name == 'wiki' ? 'docs' : selected.name )} to the dashboard.</h2>
      </div>
      <div className="manage-widgets-next-previous-ctr">
        <button className={"previous-btn"} onClick={handlePrevious}><i class="fas fa-long-arrow-alt-left"></i></button>
        <button className={"finish-btn enable"} onClick={finalize}>Finish</button>
      </div>
    </div>
  )
}

function InstallableWidget({ el, selected, setSelected }) {
  let imgSource, description, link

  if (el.name == 'snapshot') {
    imgSource = snapshotLogo
    description = 'Help members stay up to date on proposals'
    link = 'https://docs.calabara.com/v1/widgets/snapshot-description';
  }
  if (el.name == 'wiki') {
    imgSource = wikiLogo
    description = 'Token-gate documents and updates'
    link = 'https://docs.calabara.com/v1/widgets/docs-description'

  }
  if (el.name == 'calendar') {
    imgSource = calendarLogo
    description = 'Integrate a google calendar'
    link = 'https://docs.calabara.com/v1/widgets/calendar-description'
  }


  const handleClick = () => {
    setSelected(el);
  }

  return (

    <div className={"installable-widget " + (selected.name == el.name ? 'selected' : '')} onClick={handleClick}>
      <img src={imgSource} />
      <div className="installable-widget-text">
        <p>{el.name == 'wiki' ? 'docs' : el.name}</p>
        <p>{description}</p>
        <u onClick={(e) => { window.open(link); e.stopPropagation(); }}>Learn more</u>
      </div>
    </div>
  )
}


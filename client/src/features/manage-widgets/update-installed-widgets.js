import React, { useEffect, useState, useReducer, useRef } from 'react'
import { useSelector } from 'react-redux';
import calendarLogo from '../../img/calendar.svg'
import snapshotLogo from '../../img/snapshot.svg'
import creatorContestsLogo from '../../img/creator-contest.png'
import wikiLogo from '../../img/wiki.svg'
import { useParams } from 'react-router-dom';
import '../../css/manage-widgets.css'
import '../../css/settings-buttons.css'
import { RuleSelect } from './gatekeeper-toggle';
import CalendarConfiguration from './calendar-configuration';
import { showNotification } from '../notifications/notifications';
import {
  selectInstalledWidgets,
} from '../../features/dashboard/dashboard-widgets-reducer';
import { selectDashboardRules } from '../gatekeeper/gatekeeper-rules-reducer';
import useWidgets from '../hooks/useWidgets';
import useCommon from '../hooks/useCommon';
import { useWalletContext } from '../../app/WalletContext';


export default function ManageInstalledWidgetsTab({ setFunctionality, setTabHeader }) {
  const installedWidgets = useSelector(selectInstalledWidgets)
  const [selected, setSelected] = useState('')
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTabHeader('manage installed apps')
  }, [])


  useEffect(() => {
    if (selected == '') {
      setProgress(0)
    }
  }, [progress])

  // handle updates to metadata or gatekeeper settings
  useEffect(() => {
    if (progress == 1) {
      for (const [key, value] of Object.entries(installedWidgets)) {
        if (value.name == selected.name) {
          setSelected(value)
        }
      }
    }
  }, [installedWidgets])

  return (
    <>
      {progress == 0 && <SelectInstalledWidget setProgress={setProgress} selected={selected} setSelected={setSelected} setFunctionality={setFunctionality} setTabHeader={setTabHeader} />}
      {progress == 1 && <ManageWidget setProgress={setProgress} selected={selected} setTabHeader={setTabHeader} setFunctionality={setFunctionality} />}
    </>
  )
}

function SelectInstalledWidget({ setProgress, setSelected, selected, setFunctionality, setTabHeader }) {
  const installedWidgets = useSelector(selectInstalledWidgets);

  useEffect(() => {
    setTabHeader('Manage installed apps')
    setSelected('')
  }, [])



  useEffect(() => {
    if (selected != '') {
      setProgress(1);
    }
  }, [selected])

  return (
    <div className="manage-installed-widgets-tab">
      <div className="tab-message neutral">
        <p>Select an app you would like to manage</p>
      </div>
      <div className="installable-widgets-container">
        {installedWidgets.map((el) => {
          return <InstalledWidget el={el} selected={selected} setSelected={setSelected} />
        })}
      </div>
      <div className="manage-widgets-next-previous-ctr">
        <button className="previous-btn" onClick={() => { setFunctionality(0) }}><i class="fas fa-long-arrow-alt-left"></i></button>
      </div>
    </div>
  )
}


function InstalledWidget({ el, selected, setSelected }) {
  let imgSource, description, link

  const handleClick = () => {
    setSelected(el)
  }


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
  if (el.name == 'creator contests') {
    imgSource = creatorContestsLogo
    description = 'Run contests for community creatives'
    link = 'https://docs.calabara.com/coming-soon/creator-contests'
  }



  return (

    <div className="installable-widget" onClick={handleClick}>
      <img src={imgSource} />
      <div className="installable-widget-text">
        <p>{el.name == 'wiki' ? 'docs' : el.name}</p>
        <p>{description}</p>
        <u onClick={(e) => { window.open(link); e.stopPropagation(); }}>Learn more</u>
      </div>
    </div>
  )
}


function ManageWidget({ selected, setProgress, setTabHeader, setFunctionality }) {

  // show 2 divs: gatekeeper settings and metadata settings (if applicable). 
  // only calendar will have metadata for now
  // show delete button as well


  const [settingsStep, setSettingsStep] = useState(0);



  return (
    <>
      {settingsStep == 0 &&
        <WidgetSummary selected={selected} setSettingsStep={setSettingsStep} setProgress={setProgress} setTabHeader={setTabHeader} setFunctionality={setFunctionality} />
      }
      {settingsStep == 1 &&
        <MetadataSettings selected={selected} setProgress={setProgress} setSettingsStep={setSettingsStep} setTabHeader={setTabHeader} />
      }
      {settingsStep == 2 &&
        <GatekeeperSettings selected={selected} setSettingsStep={setSettingsStep} setTabHeader={setTabHeader} />
      }
    </>
  )
}

function WidgetSummary({ selected, setSettingsStep, setProgress, setTabHeader, setFunctionality }) {

  const [metadataExists, setMetadataExists] = useState(false);
  const availableRules = useSelector(selectDashboardRules)
  const installedWidgets = useSelector(selectInstalledWidgets)
  const { updateWidgets } = useWidgets();
  const { authenticated_post } = useWalletContext();
  const { ens } = useParams();

  useEffect(() => {
    if (selected != '' && Object.keys(selected.metadata).length > 0) {
      setMetadataExists(true)
    }
  }, [selected])


  useEffect(() => {
    if (selected.name == 'wiki') { setTabHeader('docs settings') }
    else { setTabHeader(selected.name + ' settings') }
  })

  const deleteWidget = async () => {

    let num_widgets = installedWidgets.length - 1;
    let res = await authenticated_post('/dashboard/removeWidget', { ens: ens, name: selected.name })
    if (res) {
      updateWidgets(0, selected)
      showNotification('success', 'success', 'application successfully deleted')

      if (num_widgets > 0) setProgress(0);

      else {
        setFunctionality(0);
      }
    }

  }

  return (
    <div className='widget-summary'>

      <div className="updateable-settings-container">
        <div className="standard-contents">
          {metadataExists &&
            <>
              <div className="standard-description">
                <p>Metadata</p>
                <p>Manage hooks to Google calendar.</p>
              </div>
              <button onClick={() => { setSettingsStep(1) }}>modify</button>
            </>
          }
        </div>
        <div className="standard-contents">
          {(selected.name != 'wiki' && Object.keys(availableRules).length > 0) &&
            <>
              <div className="standard-description">
                <p>Gatekeeper</p>
                <p>Manage gatekeeper rules applied to this app.</p>
              </div>
              <button onClick={() => { setSettingsStep(2) }}>modify</button>
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
      <div className="manage-widgets-next-previous-ctr">
        <button className="previous-btn" onClick={() => { setProgress(0) }}><i class="fas fa-long-arrow-alt-left"></i></button>
      </div>
    </div>
  )
}


function MetadataSettings({ selected, setSettingsStep, setTabHeader, setProgress }) {
  const [metadata, setMetadata] = useReducer(
    (metadata, newMetadata) => ({ ...metadata, ...newMetadata }),
    selected.metadata
  )

  return (
    <>
      <div className="update-metadata-settings">
        <div className="metadata">
          <CalendarConfiguration mode={'update'} metadata={metadata} setProgress={setProgress} setMetadata={setMetadata} setSettingsStep={setSettingsStep} setTabHeader={setTabHeader} />
        </div>
      </div>
    </>

  )
}



function GatekeeperSettings({ selected, setSettingsStep, setTabHeader }) {

  const [ruleError, setRuleError] = useState('');
  const { ens } = useParams();
  const { updateWidgetGatekeeper } = useWidgets();
  const { authenticated_post } = useWalletContext();

  useEffect(() => {
    setTabHeader('gatekeeper')
  })

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
  const [appliedRules, setAppliedRules] = useReducer(reducer, selected.gatekeeper_rules);

  const handlePrevious = () => {
    // check if selected gatekeepers have a threshold value set

    setSettingsStep(0);
  }


  const handleSave = async () => {

    for (const [key, value] of Object.entries(appliedRules)) {
      if (value == '') {
        setRuleError({ id: key })

        return;
      }
    }

    let res = await authenticated_post('/dashboard/updateWidgetGatekeeperRules', { ens: ens, gk_rules: appliedRules, name: selected.name });
    if (res) {
      updateWidgetGatekeeper(selected.name, appliedRules);
      showNotification('saved successfully', 'success', 'your changes were successfully saved')
      setSettingsStep(0);
    }
  }


  return (
    <div className="manage-widgets-configure-gatekeeper-tab">
      <div className="tab-message neutral">
        <p>Toggle the switches to apply gatekeeper rules to this app. If multiple rules are applied, the gatekeeper will pass if the connected wallet passes any of the rules. <u onClick={() => { window.open('https://docs.calabara.com/gatekeeper') }}>Learn more</u></p>
      </div>
      <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={"update-installed"} />
      <div className="manage-widgets-next-previous-ctr">
        <button className="previous-btn" onClick={handlePrevious}><i class="fas fa-long-arrow-alt-left"></i></button>
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  )

}




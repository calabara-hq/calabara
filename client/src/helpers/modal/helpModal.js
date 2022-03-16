import React, { useState, useEffect, useRef, useReducer } from 'react'
import { motion } from "framer-motion"
import axios from 'axios'
import Backdrop from './modal-backdrop.js'
import Glyphicon from '@strongdm/glyphicon'
import '../../css/modal.css'
import '../../css/wiki-modal.css'
import '../../css/settings-buttons.css'
import '../../css/status-messages.css'
import '../../css/gatekeeper-toggle.css'
import { RuleSelect } from '../../features/manage-widgets/gatekeeper-toggle.js'
import DOMPurify from 'dompurify'



import { useSelector, useDispatch } from 'react-redux';

import {
  addToWikiList,
  selectWikiList,
  removeFromWikiList,
  renameWikiList,
} from '../../features/wiki/wiki-reducer';

import {
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



export default function HelpModal({ handleClose, tab, groupID, eventData }) {
  // tab indicates which help tab we want to show
  const [infoTab, setInfoTab] = useState(false)
  const [saveVisible, setSaveVisible] = useState(false)
  const dispatch = useDispatch();

  async function handleSave() {
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
        {tab === 'deleteGatekeeper' || tab === 'addWikiGrouping' &&
          <div className="helpModalContainer">
            <button className="closeModalButton" onClick={handleClose}><Glyphicon glyph="remove" /></button>
            <div className="helpModalContent">
              <HelpTab handleClose={handleClose} tab={tab} groupID={groupID} />


            </div>
          </div>
        }

        {tab === 'calendarEvent' &&
          <div className="calendarModalContainer">
            <button className="closeModalButton" onClick={handleClose}><Glyphicon glyph="remove" /></button>
            <div className="helpModalContent">
              <ViewCalendarEvent handleClose={handleClose} eventData={eventData} />

            </div>
          </div>
        }

      </motion.div>
    </Backdrop>
  );
}


function HelpTab({ tab, handleClose, groupID }) {

  return (
    <>

      {tab === 'deleteGatekeeper' && <DeleteGatekeeperTabContent handleClose={handleClose} />}
      {tab === 'addWikiGrouping' && <AddWikiGrouping handleClose={handleClose} groupID={groupID} />}

    </>
  )
}

function ViewCalendarEvent({ handleClose, eventData }) {


  console.log(eventData)
  console.log(JSON.stringify(eventData.start))
  const [dateString, setDateString] = useState('');
  const [description, setDescription] = useState(eventData.description)
  
  function urlify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '<a target=_blank href="' + url + '">' + url + '</a>';
    });

  }

  useEffect(() => {
    var d = new Date(eventData.start)
    setDateString(d.toLocaleString())
  }, [])

  useEffect(()=>{
    if(eventData.description){
      setDescription(urlify(DOMPurify.sanitize(description)))
    }
  },[eventData.description])




  return (
    <div className="view-calendar-event-container">
      <div>
        <span><h1>{eventData.title}</h1></span>
        <span><p>{dateString}</p></span>
        {description && <span><p><b>description</b></p><p dangerouslySetInnerHTML={{__html: description}}/></span>}
        <div className="add-to-gcal">
          <button onClick={()=>{window.open(eventData.htmlLink)}}>add to google cal</button>
        </div>
      </div>
    </div>
  )
}

function DeleteGatekeeperTabContent({ handleClose }) {
  const dispatch = useDispatch();
  return (
    <div className="infoContainer">
      <h1 style={{ color: "white", fontSize: "25px" }}>This rule is currently applied to one or more of the dashboard widgets.</h1>
      <div className="infoContent">
        <p> Deleting it will remove the rule from the affected widgets, which may cause undesired side effects.</p>
        <div style={{ width: "30%", float: "right", marginTop: "20px" }}>
          <button style={{ marginRight: "10px", padding: "8px", backgroundColor: "#f2355c", color: "black", fontWeight: "bold", borderRadius: "10px", border: "none" }} onClick={() => { handleClose('delete') }}>Delete</button>
          <button style={{ padding: "8px", backgroundColor: "lightgrey", color: "black", borderRadius: "10px", border: "none" }} onClick={() => { handleClose('cancel') }}>Cancel</button>

        </div>

      </div>
    </div>
  )
}

function AddWikiGrouping({ handleClose, groupID }) {

  // if groupID is null, we are creating a new folder. Otherwise we are updating an existing one.

  const wikiList = useSelector(selectWikiList)
  const [ruleError, setRuleError] = useState(false)
  const [progress, setProgress] = useState(0)
  const [groupingName, setGroupingName] = useState("");
  const dispatch = useDispatch();
  const [isFolderError, setIsFolderError] = useState(false);
  const availableRules = useSelector(selectDashboardRules);


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


  const [tabHeader, setTabHeader] = useState('')

  useEffect(() => {
    if (progress == 0) { setTabHeader('New Folder') }
    else if (progress == 1) { setTabHeader('Gatekeeper') }
  }, [progress])



  useEffect(() => {
    if (groupID != null) {
      //setAppliedRules(wikiList[groupID].gk_rules);
      setAppliedRules({ type: 'update_all', payload: wikiList[groupID].gk_rules })

      setGroupingName(wikiList[groupID].group_name)
    }
  }, [])


  const { ens } = useParams();


  const handleNext = () => {
    // name error checking
    if (groupingName == "") {
      setIsFolderError(true)
    }
    else {
      setProgress(1);
    }
  }



  const handleSave = () => {
    // if there are no gatekeeper rules or name applied just close without doing anything    
    if (Object.keys(appliedRules).length == 0 && groupingName == "") {
      handleClose();
    }

    else {
      // check if there are any blank gatekeepers
      for (const [key, value] of Object.entries(appliedRules)) {
        if (value == "") {
          setRuleError({ id: key })
          return;
        }
      }

      if (groupID == null) {
        // it's a new folder
        axios.post('/addWikiGrouping', { ens: ens, groupingName: groupingName, gk_rules: appliedRules }).then((response) => {
          dispatch(addToWikiList({
            group_id: response.data.group_id,
            value: {
              group_name: groupingName,
              gk_rules: appliedRules,
              list: []
            }
          }))
        });
      }
      else {
        // it's an update to existing folder
        axios.post('/updateWikiGrouping', { groupID: groupID, ens: ens, groupingName: groupingName, gk_rules: appliedRules }).then((response) => {
          dispatch(renameWikiList({
            group_id: groupID,
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

  const deleteGrouping = async () => {
    await axios.post('/deleteWikiGrouping', { ens: ens, groupID: groupID })
    dispatch(removeFromWikiList(groupID));
    handleClose(1);
  }

  return (
    <div className="newWikiGrouping">
      <div className="wiki-tab-header">
        <p>{tabHeader}</p>
      </div>
      {progress == 0 &&
        <>
          <div className="newFolder">
            <div>
              <p> Folder Name </p>
              <input className={isFolderError ? 'error' : undefined} value={groupingName} onChange={(e) => { setGroupingName(e.target.value); setIsFolderError(false) }}></input>
              {isFolderError &&
                <div className="tab-message error" style={{ width: "100%" }}>
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
          <div className="help-modal-next-previous-ctr">
            <button className={"previous-btn"} onClick={handleClose}>cancel</button>
            <button className={"next-btn " + (groupingName != '' ? 'enable' : 'disabled')} onClick={handleNext}><i className="fas fa-long-arrow-alt-right"></i></button>
          </div>
        </>

      }
      {progress == 1 && <ConfigureGatekeeper handleSave={handleSave} setProgress={setProgress} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />}
    </div>
  )
}

function ConfigureGatekeeper({ setProgress, appliedRules, setAppliedRules, handleSave }) {

  const [ruleError, setRuleError] = useState(false);
  const availableRules = useSelector(selectDashboardRules);


  const handleNext = () => {
    // check if selected gatekeepers have a threshold value set
    for (const [key, value] of Object.entries(appliedRules)) {
      if (value == '') {
        setRuleError({ id: key })
        return;
      }
    }

    handleSave();

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
            <p>Toggle the switches to apply gatekeeper rules to this widget. If multiple rules are applied, the gatekeeper will pass if the connected wallet passes 1 or more rules.</p>
          </div>
          <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} />
        </>
      }

      <div className="manage-widgets-next-previous-ctr">
        <button className={"previous-btn"} onClick={() => { setProgress(0); }}><i className="fas fa-long-arrow-alt-left"></i></button>
        <button className={"save-btn"} onClick={handleNext}>save</button>
      </div>

    </div>
  )
}

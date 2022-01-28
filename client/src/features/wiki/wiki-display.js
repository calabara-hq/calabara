import '../../css/wiki-display.css'
import '../../css/wiki-editor/medium-editor.css'
import '../../css/wiki-editor/default.css'
import '../../css/wiki-editor/custom-style.css'
import Wallet from '../wallet/wallet'
import calabaraLogo from '../../img/calabara-logo.svg'
import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from "react-router-dom"
import axios from 'axios';
import Editor from 'react-medium-editor';
import DragList from '../drag-n-drop/dragList'
import HelpModal from '../../helpers/modal/helpModal'
import Glyphicon from '@strongdm/glyphicon'
import moment from "moment";



//redux
import { useSelector, useDispatch } from 'react-redux';

import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../wallet/wallet-reducer';

import {
  selectWikiList,
  populateInitialWikiList,
  selectWikiListOrganization,
} from './wiki-reducer';

import {
  selectDashboardInfo,
  populateDashboardInfo,
} from '../dashboard/dashboard-info-reducer'

import {
  selectDashboardRuleResults,
  selectDashboardRules,
  populateDashboardRules,
  applyDashboardRules,
} from '../gatekeeper/gatekeeper-rules-reducer'

export default function WikiDisplay({mode}) {
  const {ens} = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const wikiList = useSelector(selectWikiList)
  const info = useSelector(selectDashboardInfo)
  const isConnected = useSelector(selectConnectedBool)
  const walletAddress = useSelector(selectConnectedAddress)
  const dashboardRuleResults = useSelector(selectDashboardRuleResults)
  const dashboardRules = useSelector(selectDashboardRules)
  const organizationEns = useSelector(selectWikiListOrganization);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false)
  const [isWikiLoaded, setIsWikiLoaded] = useState(false);
  const [gatekeeperPass, setGatekeeperPass] = useState(false)
  const [wikiDisplayTitle, setWikiDisplayTitle] = useState(null);
  const [wikiDisplayContent, setWikiDisplayContent] = useState(null)
  const [currentWikiId, setCurrentWikiId] = useState(-1)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("");
  const [modalData, setModalData] = useState("");

  const [groupID, setGroupID] = useState(null)

  const close = (cleanup) => {
    setModalOpen(false);
    setModalTab("")
    setGroupID(null);
    if(cleanup == -1){
      setCurrentWikiId(-1);
    }
  }
  const open = () => setModalOpen(true);

  async function showModal(){
    (modalOpen ? close() : open())
  }


  async function readWiki(file_id){
    const wiki = await axios.get('/readWiki/' + file_id)
    setWikiDisplayTitle(wiki.data.filedata.title)
    setWikiDisplayContent(wiki.data.filedata.content)
    setIsWikiLoaded(true);

  }

  function checkForAdmin(){
    for(var i in info.addresses){
      if(walletAddress == info.addresses[i]){
        setIsAdmin(true);
        break;
      }
      else{
        setIsAdmin(false);
      }
    }
  }




  // get wiki list by ens.
  // if gatekeeper passes, show member + public
  // if gatekeeper doesn't pass or there isn't a gatekeeper set up, show public only
  // display the default for whichever case (public or member)


useEffect(async() =>{
  // get the dashboard info on pageload
  dispatch(populateInitialWikiList(ens));
  dispatch(populateDashboardInfo(ens))
  dispatch(populateDashboardRules(ens))


},[])

// do this to make sure no stale lists
useEffect(()=>{
  if(organizationEns.ens == ens){
    setIsMetadataLoaded(true)
  }
},[wikiList])

useEffect(async() =>{
  checkForAdmin();
},[isConnected, info])

useEffect(()=>{
    dispatch(applyDashboardRules(walletAddress))
},[dashboardRules, isConnected, wikiList])



useEffect(() => {
  if(currentWikiId != -1){
    readWiki(currentWikiId)
  }
},[currentWikiId])




const newWikiGroupingClick = () => {
  setModalTab('addWikiGrouping')
  showModal();
}

const editWikiGroupingClick = (group_id) => {
  setGroupID(group_id)
  setModalTab('addWikiGrouping')
  showModal();
}




  return (
    
    <div className={"wiki-display-container"}>
      <div className={"wiki-sidebar "  + (currentWikiId == -1 ? 'wiki-closed' : undefined)}>
        <div className="wiki-sidebar-heading">
          <h2> Docs </h2>
          {isAdmin && <button onClick={newWikiGroupingClick}><Glyphicon glyph="folder-open"/></button> }
        </div>
        {isMetadataLoaded &&
          <>
            {isAdmin &&
              <DragList editWikiGroupingClick={editWikiGroupingClick} setCurrentWikiId={setCurrentWikiId}/>
            }
            {!isAdmin &&
              <TestWikiVisibility wikiList={wikiList} setCurrentWikiId={setCurrentWikiId} dashboardRuleResults={dashboardRuleResults}/>
            }
          </>
      }
      </div>
      {currentWikiId != -1 && <RenderWiki isWikiLoaded={isWikiLoaded} isAdmin = {isAdmin} currentWikiId={currentWikiId} wikiDisplayTitle={wikiDisplayTitle} wikiDisplayContent={wikiDisplayContent}/>}
      {modalOpen && <HelpModal groupID={groupID} tab={modalTab} modalOpen={modalOpen} handleClose={close}/>}
    </div>
  
  );
}


function TestWikiVisibility({setCurrentWikiId, wikiList, dashboardRuleResults}){
  const isConnected = useSelector(selectConnectedBool)
 

  console.log(wikiList)

  useEffect(() => {

  },[isConnected])

  return(
    <div className="wiki-sidebar-list">
    <div>
      {/* map over all wiki groups*/}
      {Object.entries(wikiList).map(([group, group_data]) => {
       return  <A setCurrentWikiId={setCurrentWikiId} group={group} group_data={group_data} dashboardRuleResults={dashboardRuleResults}/>
      })}
    
    </div>
</div>
  )
}

function A({setCurrentWikiId, group, group_data, dashboardRuleResults}){


  useEffect(() => {
    console.log(dashboardRuleResults)
  },[dashboardRuleResults])

return(
  <>
  {/* if there are no gk rules, just return all the wikis */}

  {Object.keys(group_data.gk_rules).length == 0 ? (
    
    <B setCurrentWikiId={setCurrentWikiId} group_data={group_data}/>

  ) : (

    /* else, map over gk_rules in wiki list and make visible accordingly*/
    Object.entries(group_data.gk_rules).map(([key2, value2]) => {
      return(
        <>
        {/* test the threshold for the applied rule */}
      {dashboardRuleResults[key2] >= value2 ? (
        <B setCurrentWikiId={setCurrentWikiId} group_data={group_data}/>
      ) : 
      (
        console.log('nothing to display here')
      )
      }
  
      </>
    )
    })
  )
  }
  </>
)
}

function B({setCurrentWikiId, group_data}){
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  


  return(
    <>
      {group_data.list.length > 0 && <div className={"wiki-folder rotate " + (isFolderOpen ? 'down' : undefined) }onClick={() => {setIsFolderOpen(!isFolderOpen)}}><p>{group_data.group_name}</p></div>}
      {group_data.list.map((el, idx) => {
      return <div className={"wiki " + (!isFolderOpen ? 'hidden' : undefined)} onClick={() => {setCurrentWikiId(el.id)}}> <p>{el.title}</p> </div>
    })}
    </>
  )
}


function RenderWiki({isWikiLoaded, isAdmin, currentWikiId, wikiDisplayTitle, wikiDisplayContent}){
  const history = useHistory();


  return(
    <>
  {isWikiLoaded &&
    <div className="editor-display">
    <div className="editor-title">
    <textarea style={{background: 'none', marginLeft: "-8px"}} disabled type="text" value={wikiDisplayTitle}></textarea>
    {isAdmin && <button onClick={() => {history.push('wiki-edit/1/' + currentWikiId)}} className="edit-wiki-button"><Glyphicon glyph="pencil"/></button>}
    </div>


    <Editor
        className="react-editor"
        text={wikiDisplayContent}
        options={{disableEditing: true, toolbar: false, placeholder: false}}
       />

    </div>
  }
  {!isWikiLoaded &&
    <div className="editor-display">
      <div style={{backgroundColor: 'white'}} className="editor-title">
        <div className="loading" disabled style={{backgroundColor: 'lightgrey', borderRadius: '16px', marginBottom: '10px'}}></div>
      </div>
    </div>
  }
  </>
  )
}
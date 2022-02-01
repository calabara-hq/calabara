import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import axios from 'axios'
import '../../css/dashboard.css'
import * as WebWorker from '../../app/worker-client.js'
import Glyphicon from '@strongdm/glyphicon'
import ManageWidgetsModal from '../../helpers/modal/ManageWidgetsModal'
import calendarLogo from '../../img/calendar.svg'
import discordLogo from '../../img/discord.svg'
import snapshotLogo from '../../img/snapshot.svg'
import wikiLogo from '../../img/wiki.svg'




//redux
import { useSelector, useDispatch } from 'react-redux';


import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../wallet/wallet-reducer';

import {
  isMember,
  deleteMembership,
  addMembership,
  selectMemberOf,
  populateInitialMembership,
} from '../org-cards/org-cards-reducer';

import {
  setInstalledWidgets,
  setInstallableWidgets,
  populateInitialWidgets,
  selectInstalledWidgets,
  selectInstallableWidgets,
  populateVisibleWidgets,
  selectVisibleWidgets,
  updateWidgets,
} from './dashboard-widgets-reducer';

import{
  selectDashboardInfo,
  populateDashboardInfo,
  increaseMemberCount,
  decreaseMemberCount,
} from './dashboard-info-reducer'

import{
  populateDashboardRules,
  selectDashboardRules,
  applyDashboardRules,
  selectDashboardRuleResults,
} from '../gatekeeper/gatekeeper-rules-reducer'
import SettingsModal from '../../helpers/modal/SettingsModal'

//

const get = async function(params){
  var out = await axios.get(params.endpoint)
  return out;
}


const post = async function(params){
  var out = await axios.post(params.endpoint, params.data)
  return out.data;
}

 export default function Dashboard(){
   const isConnected = useSelector(selectConnectedBool)
   const walletAddress = useSelector(selectConnectedAddress)
   const installedWidgets = useSelector(selectInstalledWidgets)
   const installableWidgets = useSelector(selectInstallableWidgets)
   const visibleWidgets = useSelector(selectVisibleWidgets)
   const info = useSelector(selectDashboardInfo)
   const gatekeeperRules = useSelector(selectDashboardRules)
   const gatekeeperRuleResults = useSelector(selectDashboardRuleResults)
   const { ens } = useParams();
   const dispatch = useDispatch();

  const history = useHistory();

   const [gatekeeperResult, setGatekeeperResult] = useState(false)
   const [isAdmin, setIsAdmin] = useState(false)

   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
   const [isWidgetsModalOpen, setIsWidgetsModalOpen] = useState(false);

   const settingsModalClose = (type) => {
     if(type == 'delete'){
      history.push('/explore')
     }
     setIsSettingsModalOpen(false);

   }
   const settingsModalOpen = () => setIsSettingsModalOpen(true);
   const widgetsModalClose = () => setIsWidgetsModalOpen(false);
   const widgetsModalOpen = () => setIsWidgetsModalOpen(true);
 

   async function showSettingsModal(){
    (isSettingsModalOpen ? settingsModalClose() : settingsModalOpen())
   }

   async function showWidgetsModal(){
     (isWidgetsModalOpen ? widgetsModalClose() : widgetsModalOpen())
   }


   useEffect(() => {
     console.log(gatekeeperRules)
   },[gatekeeperRules])


   async function checkAdmin(walletAddress){
     if(info.ens == ens){
       for(var i in info.addresses){
         if(info.addresses[i] == walletAddress){
           setIsAdmin(true);
           return;
         }
       }
       setIsAdmin(false);
       return;
   }
 }

   useEffect(async() => {
     console.log('render once')
     if(info.ens == "" || info.ens != ens){
      dispatch(populateDashboardInfo(ens))
      dispatch(populateDashboardRules(ens))
     }
     dispatch(populateInitialWidgets(ens))
   },[])



   // check for admin status and fetch membership
     useEffect(()=>{
       
      (async function(){
        if(isConnected){
          checkAdmin(walletAddress)
          dispatch(populateInitialMembership(walletAddress))

        }
      }());

    },[isConnected, info])

     useEffect(() => {
      (async function(){
        if(installedWidgets.length > 0 && isConnected){
            // if there are widgets installed, we need to test the rules with the connected wallet.
            dispatch(applyDashboardRules(walletAddress))
          // need to check the rules for each widget

        }
      }());

    },[isConnected, gatekeeperRules, installedWidgets])
    






   // if gatekeeperPass is true, show all widgets
   // else, only show the ones that pass the check
     useEffect(async()=>{
     // if(Object.entries(gatekeeperRuleResults).length > 0){
        dispatch(populateVisibleWidgets(gatekeeperResult))
     // }

   }, [installedWidgets, gatekeeperRuleResults])



   return(
     <div className="dashboard-wrapper">
     <InfoCard key={info.id} ens={ens} info={info} showSettingsModal={showSettingsModal}/>
     <section className="widget-cards">

     {visibleWidgets.map((widget, idx) => {

       return <WidgetCard gatekeeperPass={gatekeeperResult} ens={ens} key={idx} orgInfo={info} widget={widget}/>;

     })}
     <ManageWidgets isAdmin={isAdmin} showWidgetsModal={showWidgetsModal}/>
     </section>
     {isSettingsModalOpen && <SettingsModal mode={'existing-org'} settingsModalOpen={settingsModalOpen} handleClose={settingsModalClose}/>}
     {isWidgetsModalOpen && <ManageWidgetsModal widgetsModalOpen={widgetsModalOpen} handleClose={widgetsModalClose}/>}

     </div>
   )
 }




function InfoCard({info, ens, showSettingsModal}){
  const membership = useSelector(selectMemberOf);
  const isConnected = useSelector(selectConnectedBool)
  const walletAddress = useSelector(selectConnectedAddress)
  const {name, members, logo, discord, website, verified} = info;

  const history = useHistory();
  const dispatch = useDispatch();

  const isMemberOf = dispatch(isMember(ens))
  const [isInfoLoaded, setIsInfoLoaded] = useState(false)

  


  async function handleJoinOrg(){
    await dispatch(addMembership(walletAddress, ens))
    dispatch(increaseMemberCount())
  }

  async function handleLeaveOrg(){
    await dispatch(deleteMembership(walletAddress, ens))
    dispatch(decreaseMemberCount())

  }

  useEffect(()=>{
      if(info.ens == ens){
        setIsInfoLoaded(true)
      }
  })


  // process images once we have the correct info
  useEffect(async()=>{
    await WebWorker.processImages();

  },[isInfoLoaded])



  return(
    <div className="info">
    <button className="edit-settings-btn" type="button" onClick={showSettingsModal}><i className="fas fa-cog"></i></button>
    <div className="info-content">
    {isInfoLoaded &&
      <>
    <img data-src={logo}/>
    <h1> {name} </h1>
    {(!isMemberOf && isConnected) && <button name="join" onClick={handleJoinOrg} type="button" className="subscribe-btn">Join</button>}
    {(isMemberOf && isConnected) && <button name="leave" onClick={handleLeaveOrg} type="button" className="subscribe-btn">Leave</button>}
    <p> {members} members </p>
      <a href={'https://' + website} target="_blank">{website}</a>
    </>
    }
    </div>
    </div>
  )

}

function ManageWidgets({isAdmin, showWidgetsModal}){

  const isConnected = useSelector(selectConnectedBool)


  useEffect(()=>{
    console.log(isAdmin)
  },[isAdmin])

  return(
    <>


    {(isAdmin && isConnected) && 
      <article className="widget-card manage-widgets" onClick={showWidgetsModal}>
      <div>
      <span><Glyphicon className="managePencil" glyph="pencil"/></span>
      <h1> manage widgets </h1>
      </div>
      </article>
    }
    </>
  )
}

export function WidgetCard({gatekeeperPass, orgInfo, widget, btnState, setBtnState, ens}){

  const {name, link, widget_logo, metadata, gatekeeper_enabled, notify} = widget;
  const [hasNotification, setHasNotification] = useState(false)

  const dispatch = useDispatch();
  const history = useHistory();



  function handleClick(){
    // block widget functionality if we are in edit mode
    if(!btnState){
    console.log(link)
    if(name == 'snapshot'){
    history.push('/' + ens + '/snapshot')
    }
    else if(name == 'calendar'){
      history.push('/' + ens + '/calendar/' + metadata.calendarID)
    }
    else if(name == 'wiki'){
      history.push('/' + ens + '/wiki')
    }
    else window.open(link)
    }
  }

  async function handleDeleteWidget(){
    var request = await post({endpoint: '/removeWidget', data: {ens: ens, name: name}})
    dispatch(updateWidgets(0, widget));

  }

  var logoImg;
  if(name == 'snapshot'){logoImg = snapshotLogo}
  if(name == 'calendar'){logoImg = calendarLogo}
  if(name == 'discord'){logoImg = discordLogo}
  if(name == 'wiki'){logoImg = wikiLogo}


  return(

    <article className="widget-card" onClick={handleClick}>
    {(notify == 1  && !btnState)&& <button><Glyphicon glyph="bell"/></button>}
    {btnState == true && <button onClick={handleDeleteWidget}><Glyphicon glyph="minus"/></button>}
    <div className="card-image">
    <img src={logoImg}/>
    </div>
    <h2> {name}</h2>
    </article>


  )

}


function NewWidgetButton({btnState, setBtnState}){

  function handleEditClick(){
  //  setBtnState(!btnState.btnState)
    setBtnState(!btnState)
  // when clicked, we want to get all available widgets,
  // parse out the ones already installed then print them
  // all of that will happen in the main Dashboard component
  }

    return(
      <div className = "newButtonDiv">
      <button type="button" className="editWidgetBtn"onClick={handleEditClick}>
      {btnState == false && <Glyphicon glyph="pencil"/>}
      {btnState == true && <Glyphicon glyph="check"/>}
      </button>
      </div>
    )
  }

  function NewWidgets({ens, orgInfo, btnState, setBtnState}){

    const installableWidgets = useSelector(selectInstallableWidgets);


    useEffect(()=>{
      //WebWorker.processImages();
    },[installableWidgets])

    return(
      <>
      {installableWidgets.map((widget)=>{
        return <NewWidgetCard ens={ens} orgInfo={orgInfo} key={widget.widget_id} widget={widget}/>;

      })}
      </>

  )
}


export function NewWidgetCard({orgInfo, widget, ens}){
  console.log(widget)
  const {name, widget_logo} = widget;
  const [bounce, setBounce] = useState(0);
  const [widgetUrl, setWidgetUrl] = useState('');
  const [urlError, setUrlError] = useState(0);
  const [gatekeeperEnable] = useState(false);
  const [isGatekeeperOn, setIsGatekeeperOn] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const addWidget = () => {
    if(name == 'calendar'){
      history.push('/' + ens + '/calendar-integration')
    }
    else{
    setBounce(1)
    }
  }

  const handleUrlChange = (e) => {
    setWidgetUrl(e.target.value)
  }

  const handleWidgetSubmit = async() => {
    console.log(widgetUrl)
    const regex = new RegExp(name, "i");
    console.log(regex)
    console.log(widgetUrl.match(regex))
    if(widgetUrl.match(regex) == null){
      setUrlError(1)
    }
    else{
      setUrlError(0)
      const params = {endpoint: '/addWidget', data: {ens: ens, name: name, link: widgetUrl, widget_logo: widget_logo, gatekeeper_enabled: isGatekeeperOn}}
      var req = await post(params)
      dispatch(updateWidgets(1, {ens: ens, name: name, link: widgetUrl, widget_logo: widget_logo, gatekeeper_enabled: isGatekeeperOn, notify: 0}))

    }
  }


  const handleToggle = () =>{
    setIsGatekeeperOn(!isGatekeeperOn)
  }



  useEffect(() =>{
  },[isGatekeeperOn])

  return(
    <article className={`new-widget-card ${bounce == 0 ? 'bounce' : 'no-bounce'}`}>
    {bounce == 0 && <button className="configureWidgetBtn" onClick={addWidget}><Glyphicon glyph="plus"/></button>}
    <div className="card-image">
    <img data-src={widget_logo}/>
    </div>
    <h2> {name}</h2>
    <div className="widgetUrl">
    <div className="urlInput">
    {bounce == 1 && <input placeholder={`${name} url`} value={widgetUrl} onChange={handleUrlChange} type="text"></input>}
    </div>
    {urlError == 1 && <p className='urlError'>hmm... that doesn't seem like a valid link for this widget</p>}
    </div>
    {bounce == 1 &&
      <>
    <div className="gatekeeperSelect">
    <label className="toggleText">enable gatekeeper</label>
    <input checked={isGatekeeperOn} onChange={handleToggle} className="react-switch-checkbox" id={`react-switch-toggle`} type="checkbox"/>
    <label  style={{ background: isGatekeeperOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle`}>
      <span className={`react-switch-button`} />
    </label>

    </div>

    <div className="widgetSubmit">
    <button type="button" onClick={handleWidgetSubmit}>Add widget</button>
    </div>
    </>
    }
    </article>
  )

}

import React, { useEffect, useState, componentDidMount } from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom"
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../../css/org-cards.css'
import Dashboard from '../dashboard/dashboard'
import SettingsModal from '../../helpers/modal/SettingsModal'
import * as WebWorker from '../../app/worker-client'
import { AnimatePresence, motion } from "framer-motion";
import Glyphicon from '@strongdm/glyphicon'
import { showNotification } from '../notifications/notifications'

//redux
import { useSelector, useDispatch } from 'react-redux';
import {
  isMember,
  deleteMembership,
  addMembership,
  selectMemberOf,
  populateInitialMembership,
  populateInitialOrganizations,
  selectOrganizations,
  selectCardsPulled,
} from './org-cards-reducer';

import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../wallet/wallet-reducer';
//

import {
  clearWidgets,
} from '../dashboard/dashboard-widgets-reducer'
import { connectWallet } from '../wallet/wallet'


export default function Cards(){
  const isConnected = useSelector(selectConnectedBool);
  const walletAddress = useSelector(selectConnectedAddress);
  const organizations = useSelector(selectOrganizations);
  const areCardsPulled = useSelector(selectCardsPulled);
  const dispatch = useDispatch();
  // clear redux store so that clicking into a new dashboard doesn't briefly render old data
  dispatch(clearWidgets());

  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  // there is room for optimization here. The webworker is fetching new resources everytime this page loads.
  // i created a cardsPulled state in the org-cards reducer that may come in handy for a solution

  useEffect(()=>{
      // pull org cards
      dispatch(populateInitialOrganizations())
      // set the joined orgs for this wallet address
      dispatch(populateInitialMembership(walletAddress));
  }, [])

  useEffect(()=>{
    if(organizations.length > 0){
      WebWorker.processImages().then((result) => {
        console.log(result)
      })

    }
  },[organizations])

  // don't want to call WW everytime. Let's cache the img blob in the reducer. When we 
  // add a new org, just directly inject the img src  


  return(
    <>
    <div className="cards-flex">
    <NewOrgButton modalOpen={modalOpen} close={close} open={open} isConnected={isConnected}/>
    <section className="cards">

    {organizations.map((org, idx) => {
      return <DaoCard key={idx} org={org}/>;
    })}
    </section>
    </div>
    {modalOpen && <SettingsModal mode={'new-org'} modalOpen={modalOpen} handleClose={close}/>}
    </>
 )}


function DaoCard({org}){
  console.log(org)
  const {name, logo, verified, ens} = org;
  const memership = useSelector(selectMemberOf);
  const isConnected = useSelector(selectConnectedBool)
  const walletAddress = useSelector(selectConnectedAddress)
  const dispatch = useDispatch();
  const [members, setMembers] = useState(org.members)

  var isMemberOf = dispatch(isMember(ens))

  const history = useHistory();

  function handleJoinOrg(){
    dispatch(addMembership(walletAddress, ens))
    setMembers(members + 1);
  }

  function handleLeaveOrg(){
    dispatch(deleteMembership(walletAddress, ens))
    setMembers(members - 1);
  }



  const handleClick = (e) => {
    if(e.target.name === 'join'){
      e.preventDefault();
      e.stopPropagation();
    }
    else if(e.target.name === 'leave'){
      e.preventDefault();
      e.stopPropagation();
    }

    else{
    history.push('/' + ens + '/dashboard')
    }
  }

  // rerender the card when membership details change
  useEffect(() =>{},[isMemberOf])


  return(

    <article className="dao-card" onClick={handleClick}>
      {logo.substring(0,10) === 'img/logos/'

        ? <img data-src={logo}/>
        : <img src={logo}/>

     }
    <h2> {name}</h2>
    <p>{members} members</p>
    {!isMemberOf && <button name="join" onClick={handleJoinOrg} type="button" className="subscribe-btn">{'Join'}</button>}
    {isMemberOf && <button name="leave" onClick={handleLeaveOrg} type="button" className="subscribe-btn">{'Leave'}</button>}
    </article>

  )}

  function NewOrgButton({modalOpen, close, open, isConnected}){
    const [didUserRefuseConnect, setDidUserRefuseConnect] = useState(false);

    async function showModal(){
      (modalOpen ? close() : open())
    }

    const history = useHistory();

    const handleClick = () => {
        history.push('/setup/')
    }


    const handleNewOrg = async() => {
      
      

      if(isConnected){
          setDidUserRefuseConnect(false)
          open();
        }
        else{
          setDidUserRefuseConnect(true);
          showNotification('please sign in', 'hint', 'please sign in to create a dashboard')
        }
      
  
    }

    return(
      <div className="newOrgBox">
        <button className="newOrgBtn" type="button" onClick={handleNewOrg}>🚀 New Org</button>
      </div>
      )
  }

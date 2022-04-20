import React, { useEffect, useState, componentDidMount } from 'react'
import { useHistory } from "react-router-dom"
import '../../css/org-cards.css'
import * as WebWorker from '../../app/worker-client'
import { showNotification } from '../notifications/notifications'
import { fetchOrganizations, fetchUserMembership } from '../common/common'
import plusSign from '../../img/plus-sign.svg'


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
  selectMembershipPulled,
  selectLogoCache
} from './org-cards-reducer';

import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../wallet/wallet-reducer';

import {
  clearDashboardData,
  clearWidgets,
  dashboardWidgetsReset,
} from '../dashboard/dashboard-widgets-reducer'
import { auxillaryConnect } from '../wallet/wallet'
import { dashboardInfoReset } from '../dashboard/dashboard-info-reducer'


export default function Cards() {
  const isConnected = useSelector(selectConnectedBool);
  const walletAddress = useSelector(selectConnectedAddress);
  const organizations = useSelector(selectOrganizations);
  const cardsPulled = useSelector(selectCardsPulled);
  const membershipPulled = useSelector(selectMembershipPulled);
  const membership = useSelector(selectMemberOf);
  const logoCache = useSelector(selectLogoCache);

  const dispatch = useDispatch();


  // clear redux store so that clicking into a new dashboard doesn't briefly render stale data
  dispatch(dashboardInfoReset);
  dispatch(dashboardWidgetsReset);



  // there is room for optimization here. The webworker is fetching new resources everytime this page loads.
  // i created a cardsPulled state in the org-cards reducer that may come in handy for a solution

  useEffect(() => {
    fetchOrganizations(cardsPulled, dispatch)
  }, [])

  useEffect(() => {
    fetchUserMembership(walletAddress, membershipPulled, dispatch)
  }, [walletAddress])


  useEffect(() => {
    if (organizations.length > 0) {
      WebWorker.processImages(dispatch, logoCache);
    }
  }, [organizations])


  // don't want to call WW everytime. Let's cache the img blob in the reducer. When we 
  // add a new org, just directly inject the img src  


  return (
    <>
      <div className="cards-flex">
        <section className="cards">
          <NewOrgButton isConnected={isConnected} />
          {organizations.map((org, idx) => {
            return <DaoCard key={idx} org={org} membership={membership} />;
          })}
        </section>
      </div>
    </>
  )
}


function DaoCard({ org, membership }) {
  const { name, logo, verified, ens } = org;
  const isConnected = useSelector(selectConnectedBool)
  const walletAddress = useSelector(selectConnectedAddress)
  const dispatch = useDispatch();
  const [members, setMembers] = useState(org.members)
  const [isMemberOf, setIsMemberOf] = useState(false)

  const history = useHistory();

  function handleJoinOrg() {
    if (isConnected) {
      dispatch(addMembership(walletAddress, ens))
      setMembers(members + 1);
    }
    else {
      auxillaryConnect();
    }
  }

  function handleLeaveOrg() {
    dispatch(deleteMembership(walletAddress, ens))
    setMembers(members - 1);
  }



  const handleClick = (e) => {
    if (e.target.name === 'join') {
      e.preventDefault();
      e.stopPropagation();
    }
    else if (e.target.name === 'leave') {
      e.preventDefault();
      e.stopPropagation();
    }

    else {
      history.push('/' + ens + '/dashboard')
    }
  }

  // rerender the card when membership details change
  useEffect(() => {
    let res = dispatch(isMember(ens))
    setIsMemberOf(res)
  }, [membership])


  return (

    <article className="dao-card" onClick={handleClick}>
         <img data-src={logo} />
      <h2> {name}</h2>
      <p>{members} members</p>
      {isConnected &&
        <>
          {!isMemberOf && <button name="join" onClick={handleJoinOrg} type="button" className="subscribe-btn">{'Join'}</button>}
          {isMemberOf && <button name="leave" onClick={handleLeaveOrg} type="button" className="subscribe-btn">{'Leave'}</button>}
        </>
      }
    </article>

  )
}





function NewOrgButton({ isConnected }) {
  const [didUserRefuseConnect, setDidUserRefuseConnect] = useState(false);

  const history = useHistory();

  const handleNewOrg = async () => {

    if (isConnected) {
      setDidUserRefuseConnect(false)
      history.push('new/settings')
    }
    else {
      setDidUserRefuseConnect(true);
      showNotification('please sign in', 'hint', 'please sign in to create a dashboard')
    }
  }
  return (


    <article className="new-org" onClick={handleNewOrg}>
      <img src={plusSign}/>
      <h2>New</h2>
    </article>


  )
}

import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import '../../css/org-cards.css'
import * as WebWorker from '../../app/worker-client'
import { showNotification } from '../notifications/notifications'
import plusSign from '../../img/plus-sign.svg'
import { fetchOrganizations } from './org-cards-data-fetch'

//redux
import { useSelector, useDispatch } from 'react-redux';
import {
  selectMemberOf,
  selectOrganizations,
  selectCardsPulled,
  selectMembershipPulled,
  selectLogoCache
} from './org-cards-reducer';

import {
  dashboardWidgetsReset,
} from '../dashboard/dashboard-widgets-reducer'

import { gatekeeperReset } from '../gatekeeper/gatekeeper-rules-reducer'
import { dashboardInfoReset } from '../dashboard/dashboard-info-reducer'
import useOrganization from '../hooks/useOrganization'
import useCommon from '../hooks/useCommon'
import { selectIsConnected, selectWalletAddress } from '../../app/sessionReducer'

let resource = fetchOrganizations()

export default function Cards() {
  const isConnected = useSelector(selectIsConnected);
  const walletAddress = useSelector(selectWalletAddress);
  //const organizations = useSelector(selectOrganizations);
  const cardsPulled = useSelector(selectCardsPulled);
  const membershipPulled = useSelector(selectMembershipPulled);
  const membership = useSelector(selectMemberOf);
  const logoCache = useSelector(selectLogoCache);
  const { fetchOrganizations } = useCommon();
  const { fetchUserMembership } = useOrganization();
  const dispatch = useDispatch();
  const [organizations, setOrganizations] = useState(resource.read())

  useEffect(() => {

    // check for new orgs + check session
    fetch('/organizations/organizations')
      .then(res => res.json())
      .then(res => {
        setOrganizations(prevState => {
          return prevState
        })
      })

  }, [])


  // there is room for optimization here. The webworker is fetching new resources everytime this page loads.
  // i created a cardsPulled state in the org-cards reducer that may come in handy for a solution
  /*
  useEffect(() => {
    // clear redux store so that clicking into a new dashboard doesn't briefly render stale data
    dispatch(dashboardInfoReset());
    dispatch(dashboardWidgetsReset());
    dispatch(dashboardInfoReset());
    dispatch(gatekeeperReset());
    fetchOrganizations()
  }, [])
*/


  useEffect(() => {
    fetchUserMembership(walletAddress, membershipPulled)
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
  const isConnected = useSelector(selectIsConnected)
  const walletAddress = useSelector(selectWalletAddress)
  const dispatch = useDispatch();
  const [members, setMembers] = useState(org.members)
  const [isMemberOf, setIsMemberOf] = useState(false)
  const { deleteMembership, addMembership, isMember } = useOrganization();

  const history = useHistory();


  useEffect(() => {
    setIsMemberOf(isMember(ens))
  }, [])

  function handleJoinOrg() {

    addMembership(ens)
    setMembers(members + 1);
    setIsMemberOf(true)

  }

  function handleLeaveOrg() {
    deleteMembership(ens)
    setMembers(members - 1);
    setIsMemberOf(false);
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


  return (

    <article className="dao-card" onClick={handleClick}>
      <img data-src={logo} />
      <h3> {name.length > 20 ? name.slice(0, 20) + '...' : name}</h3>
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
      <img src={plusSign} />
      <h2>New</h2>
    </article>


  )
}

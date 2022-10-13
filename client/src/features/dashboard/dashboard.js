import React, { useEffect, useState, createRef } from 'react'
import { useHistory, useParams } from "react-router-dom"
import '../../css/dashboard.css'
import * as WebWorker from '../../app/worker-client.js'
import Glyphicon from '@strongdm/glyphicon'
import calendarLogo from '../../img/calendar.svg'
import snapshotLogo from '../../img/snapshot.svg'
import creatorContestsLogo from '../../img/creator-contest.png'
import wikiLogo from '../../img/wiki.svg'
import { showNotification } from '../notifications/notifications'
import useDiscordAuth from '../hooks/useDiscordAuth'
//redux
import { useSelector, useDispatch } from 'react-redux';


import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../wallet/wallet-reducer';

import {
  selectMemberOf,
  selectLogoCache,
  selectMembershipPulled,
} from '../org-cards/org-cards-reducer';

import {
  selectVisibleWidgets,
} from './dashboard-widgets-reducer';

import {
  selectDashboardInfo,
} from './dashboard-info-reducer'

import {
  selectDashboardRules,
  selectDashboardRuleResults,
} from '../gatekeeper/gatekeeper-rules-reducer'

import { selectDiscordId, setDiscordId } from '../user/user-reducer';
import useDashboardRules from '../hooks/useDashboardRules'
import useWidgets from '../hooks/useWidgets'
import useOrganization from '../hooks/useOrganization'
import useCommon from '../hooks/useCommon'
import { useWalletContext } from '../../app/WalletContext'


export default function Dashboard() {

  const isConnected = useSelector(selectConnectedBool)
  const walletAddress = useSelector(selectConnectedAddress)
  const visibleWidgets = useSelector(selectVisibleWidgets)
  const info = useSelector(selectDashboardInfo)
  const gatekeeperRules = useSelector(selectDashboardRules)
  const gatekeeperRuleResults = useSelector(selectDashboardRuleResults)
  const discordId = useSelector(selectDiscordId);
  const membershipPulled = useSelector(selectMembershipPulled);
  const membership = useSelector(selectMemberOf)
  const { ens } = useParams();
  const dispatch = useDispatch();
  const { applyDashboardRules } = useDashboardRules();
  const { populateVisibleWidgets } = useWidgets();
  const { batchFetchDashboardData } = useCommon();
  const { fetchUserMembership } = useOrganization();
  const [gatekeeperResult, setGatekeeperResult] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userAuth, setUserAuth] = useState(null)

  const { onOpen: userOnOpen, authorization: userAuthorization, error: userError, isAuthenticating: userIsAuthenticating } = useDiscordAuth("identify", userAuth, setUserAuth)

  let discordIntegrationProps = {
    userOnOpen,
    userAuthorization,
    userError,
    userIsAuthenticating,
    userAuth,
    setUserAuth,
  }

  async function checkAdmin(walletAddress) {
    if (info.ens == ens) {
      for (var i in info.addresses) {
        if (info.addresses[i] == walletAddress) {
          setIsAdmin(true);
          return;
        }
      }
      setIsAdmin(false);
      return;
    }
  }


  useEffect(() => {
    batchFetchDashboardData(ens, info);
  }, [info])


  useEffect(() => {
    if (walletAddress) {
      checkAdmin(walletAddress)
      fetchUserMembership(walletAddress, membershipPulled)
    }
  }, [isConnected, walletAddress, info])


  useEffect(() => {
    // if there are widgets installed, we need to test the rules with the connected wallet.
    applyDashboardRules(walletAddress)
  }, [walletAddress, discordId, gatekeeperRules])


  useEffect(() => {
    populateVisibleWidgets(isAdmin)
  }, [gatekeeperRuleResults, isAdmin])

  useEffect(() => { }, [isAdmin])


  return (
    <div className="dashboard-wrapper">
      {info && <InfoCard ens={ens} info={info} membership={membership} discordIntegrationProps={discordIntegrationProps} />}
      <section className="widget-cards">

        {visibleWidgets.map((widget, idx) => {

          return <WidgetCard gatekeeperPass={gatekeeperResult} ens={ens} key={idx} orgInfo={info} widget={widget} />;

        })}
        <ManageWidgets isAdmin={isAdmin} />
      </section>

    </div>
  )
}


function InfoCard({ info, ens, discordIntegrationProps }) {
  const isConnected = useSelector(selectConnectedBool)
  const logoCache = useSelector(selectLogoCache);
  const dashboardRules = useSelector(selectDashboardRules);
  const discord_id = useSelector(selectDiscordId);
  const [promptDiscordLink, setPromptDiscordLink] = useState(false);
  const { deleteMembership, addMembership, isMember } = useOrganization();
  const history = useHistory();
  const dispatch = useDispatch();
  const [members, setMembers] = useState(0);
  const [isMemberOf, setIsMemberOf] = useState(false);
  const [isInfoLoaded, setIsInfoLoaded] = useState(false);
  const imgRef = createRef(null);
  const { authenticated_post } = useWalletContext();


  let {
    userOnOpen,
    userAuth,
  } = discordIntegrationProps


  function handleJoinOrg() {
    addMembership(ens)
    setMembers(members + 1);
    setIsMemberOf(true)
  }

  function handleLeaveOrg() {
    deleteMembership(ens)
    setMembers(members - 1);
    setIsMemberOf(false)
  }

  function handleSettingsOpen() {
    if (!isConnected) {
      showNotification('please sign in', 'hint', 'please connect your wallet')
    }
    else {
      history.push('settings');
    }
  }

  useEffect(() => {
    if (info.ens == ens && !isInfoLoaded) {
      setIsInfoLoaded(true)
    }
  }, [info])


  useEffect(() => {
    setIsMemberOf(isMember(ens))
    setMembers(info.members)
    WebWorker.processImages(dispatch, logoCache);
  }, [isInfoLoaded])


  useEffect(() => {
    if (info.logoBlob && imgRef.current != null) {

      WebWorker.updateLogo(dispatch, info.logo, info.logoBlob)
    }
  }, [info.logoBlob, imgRef])




  useEffect(() => {
    let promptDiscord = false
    if (isConnected) {
      Object.keys(dashboardRules).map((key) => {
        if (dashboardRules[key].type === 'discord') {
          if (!discord_id) {
            promptDiscord = true;
          }
          else if (discord_id && isConnected) {
            promptDiscord = false;
          }
        }
      })
    }
    setPromptDiscordLink(promptDiscord)
  }, [dashboardRules, discord_id])



  useEffect(() => {
    (async () => {
      if (!userAuth) return
      if (isConnected) {
        let res = await authenticated_post('/discord/addUserDiscord', { discord_id: userAuth.userId });
        if (res) {
          dispatch(setDiscordId(userAuth.userId))
          return
        }
      }
    })();

  }, [userAuth])
  // if a users wallet is connected, check for a discord id in the server. If it's not there and 
  // there is a discord rule for this org, prompt them to link their discord acc.


  const linkDiscord = () => {
    return userOnOpen();
  }

  return (
    <div className="info-container">
      <div className="info">
        <button className="edit-settings-btn" type="button" onClick={handleSettingsOpen}><i className="fas fa-cog"></i></button>
        <div className="info-content">
          {isInfoLoaded &&
            <>
              <img id="info-logo" ref={imgRef} data-src={info.logo} />
              <h1> {info.name} </h1>
              {(!isMemberOf && isConnected) && <button name="join" onClick={handleJoinOrg} type="button" className="subscribe-btn">Join</button>}
              {(isMemberOf && isConnected) && <button name="leave" onClick={handleLeaveOrg} type="button" className="subscribe-btn">Leave</button>}
              <p> {members} members </p>
              <a href={'//' + info.website} target="_blank">{info.website}</a>
            </>
          }
        </div>
      </div>
      {promptDiscordLink &&
        <div className="dashboard-notify-container">
          <span><Glyphicon glyph="info-sign" /></span>
          <div className="dashboard-notify-content">
            <p>{info.name} uses discord roles for certain applications. Link your discord to unlock the full dashboard</p>
            <button onClick={linkDiscord}>link discord</button>
          </div>
        </div>
      }
    </div>
  )

}

function ManageWidgets({ isAdmin }) {

  const isConnected = useSelector(selectConnectedBool)
  const history = useHistory();

  useEffect(() => {
  }, [isAdmin])

  return (
    <>


      {(isAdmin && isConnected) &&
        <article className="widget-card manage-widgets" onClick={() => { history.push('manageWidgets') }}>
          <div>
            <span><i className="fas fa-pencil-alt pencil-logo"></i></span>
            <h2> manage apps </h2>
          </div>
        </article>
      }
    </>
  )
}

export function WidgetCard({ gatekeeperPass, orgInfo, widget, btnState, setBtnState, ens }) {

  const { name, link, widget_logo, metadata, gatekeeper_enabled, notify } = widget;
  const [hasNotification, setHasNotification] = useState(false)
  const { updateWidgets } = useWidgets();
  const { authenticated_post } = useWalletContext();
  const dispatch = useDispatch();
  const history = useHistory();


  function handleClick() {
    // block widget functionality if we are in edit mode
    if (!btnState) {
      if (name === 'snapshot') {
        history.push('/' + ens + '/snapshot')
      }
      else if (name === 'calendar') {
        history.push('/' + ens + '/calendar/' + metadata.calendarID)
      }
      else if (name === 'wiki') {
        history.push('/' + ens + '/docs')
      }

      else if (name === 'creator contests') {
        history.push('/' + ens + '/creator_contests')
      }

    }
  }

  async function handleDeleteWidget() {
    let res = await authenticated_post('/dashboard/removeWidget', { ens: ens, name: name })
    if (res) updateWidgets(0, widget);

  }

  var logoImg;
  if (name === 'snapshot') { logoImg = snapshotLogo }
  if (name === 'calendar') { logoImg = calendarLogo }
  if (name === 'wiki') { logoImg = wikiLogo }
  if (name === 'creator contests') { logoImg = creatorContestsLogo }



  return (

    <article className="widget-card" onClick={handleClick}>
      {(notify == 1 && !btnState) && <button><Glyphicon glyph="bell" /></button>}
      {btnState == true && <button onClick={handleDeleteWidget}><Glyphicon glyph="minus" /></button>}
      <div className="card-image">
        <img src={logoImg} />
      </div>
      {/*<h2> {name == 'wiki' ? 'docs' : name}</h2>*/}
    </article>


  )

}




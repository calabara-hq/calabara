import React, { useEffect, useState, createRef } from 'react'
import { useHistory, useParams } from "react-router-dom"
import axios from 'axios'
import '../../css/dashboard.css'
import * as WebWorker from '../../app/worker-client.js'
import Glyphicon from '@strongdm/glyphicon'
import calendarLogo from '../../img/calendar.svg'
import discordLogo from '../../img/discord.svg'
import snapshotLogo from '../../img/snapshot.svg'
import wikiLogo from '../../img/wiki.svg'
import { batchFetchDashboardData, fetchUserMembership } from '../common/common'

import { showNotification } from '../notifications/notifications'


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
  selectLogoCache,
  selectMembershipPulled,
} from '../org-cards/org-cards-reducer';

import {
  populateVisibleWidgets,
  selectVisibleWidgets,
  updateWidgets,
} from './dashboard-widgets-reducer';

import {
  selectDashboardInfo,
  populateDashboardInfo,
  increaseMemberCount,
  decreaseMemberCount,
} from './dashboard-info-reducer'

import {
  selectDashboardRules,
  applyDashboardRules,
  selectDashboardRuleResults,
} from '../gatekeeper/gatekeeper-rules-reducer'

import { selectDiscordId, setDiscordId } from '../user/user-reducer';
import { FieldsOnCorrectTypeRule } from 'graphql'


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

  const [gatekeeperResult, setGatekeeperResult] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)


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
    batchFetchDashboardData(ens, info, dispatch);
  }, [info])


  useEffect(() => {
    if (walletAddress) {
      checkAdmin(walletAddress)
      fetchUserMembership(walletAddress, membershipPulled, dispatch)
    }
  }, [walletAddress, info])


  useEffect(() => {
    // if there are widgets installed, we need to test the rules with the connected wallet.
    dispatch(applyDashboardRules(walletAddress))
  }, [walletAddress, discordId, gatekeeperRules])


  useEffect(() => {
    dispatch(populateVisibleWidgets())
  }, [gatekeeperRuleResults])

  useEffect(() => { }, [isAdmin])

  return (
    <div className="dashboard-wrapper">
      {info && <InfoCard ens={ens} info={info} membership={membership} />}
      <section className="widget-cards">

        {visibleWidgets.map((widget, idx) => {

          return <WidgetCard gatekeeperPass={gatekeeperResult} ens={ens} key={idx} orgInfo={info} widget={widget} />;

        })}
        <ManageWidgets isAdmin={isAdmin} />
      </section>

    </div>
  )
}




function InfoCard({ info, ens, membership }) {
  const isConnected = useSelector(selectConnectedBool)
  const walletAddress = useSelector(selectConnectedAddress)
  const logoCache = useSelector(selectLogoCache)
  const dashboardRules = useSelector(selectDashboardRules);
  const discord_id = useSelector(selectDiscordId)
  const [promptDiscordLink, setPromptDiscordLink] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const isMemberOf = dispatch(isMember(ens))
  const [isInfoLoaded, setIsInfoLoaded] = useState(false)
  const imgRef = createRef(null);

  const [logo, setLogo] = useState(info.logo)

  function handleJoinOrg() {
    dispatch(addMembership(walletAddress, ens))
    dispatch(increaseMemberCount())
  }

  function handleLeaveOrg() {
    dispatch(deleteMembership(walletAddress, ens))
    dispatch(decreaseMemberCount())
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
    if (info.ens == ens) {
      setIsInfoLoaded(true)
    }
  }, [info])


  useEffect(() => {
    WebWorker.processImages(dispatch, logoCache);
  }, [isInfoLoaded])


  useEffect(() => {
    if(info.logoBlob && imgRef.current != null){
      console.log(imgRef)
      WebWorker.updateLogo(dispatch, info.logo, info.logoBlob)
    }
  }, [info.logoBlob, imgRef])




  useEffect(() => {
    Object.keys(dashboardRules).map((key) => {
      if (dashboardRules[key].gatekeeperType === 'discord') {
        if (!discord_id) {
          setPromptDiscordLink(isConnected)
        }
        else if (discord_id && isConnected) {
          setPromptDiscordLink(false)
        }
      }
    })
  }, [dashboardRules, discord_id, isConnected])





  // if a users wallet is connected, check for a discord id in the server. If it's not there and 
  // there is a discord rule for this org, prompt them to link their discord acc.


  const linkDiscord = () => {
    let popout;
    if (process.env.NODE_ENV === 'development') {
      popout = window.open(`https://discord.com/api/oauth2/authorize?client_id=895719351406190662&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Foauth%2Fdiscord&response_type=code&scope=identify&state=${walletAddress},user,${ens}`, 'popUpWindow', 'height=700,width=600,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
    }

    else if (process.env.NODE_ENV === 'production') {
      popout = window.open(`https://discord.com/api/oauth2/authorize?client_id=895719351406190662&redirect_uri=https%3A%2F%2Fcalabara.com%2Foauth%2Fdiscord&response_type=code&scope=identify&state=${walletAddress},user,${ens}`, 'popUpWindow', 'height=700,width=600,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')

    }

    var pollTimer = window.setInterval(async function () {
      if (popout.closed !== false) {
        window.clearInterval(pollTimer);
        let isDiscordLinked = await axios.post('/discord/getUserDiscord', { walletAddress: walletAddress })

        if (isDiscordLinked.data) dispatch(setDiscordId(isDiscordLinked.data))

      }
    }, 1000);
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
              <p> {info.members} members </p>
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

    }
  }

  async function handleDeleteWidget() {
    var request = await axios.post('/removeWidget', { ens: ens, name: name })
    dispatch(updateWidgets(0, widget));

  }

  var logoImg;
  if (name === 'snapshot') { logoImg = snapshotLogo }
  if (name === 'calendar') { logoImg = calendarLogo }
  if (name === 'wiki') { logoImg = wikiLogo }


  return (

    <article className="widget-card" onClick={handleClick}>
      {(notify == 1 && !btnState) && <button><Glyphicon glyph="bell" /></button>}
      {btnState == true && <button onClick={handleDeleteWidget}><Glyphicon glyph="minus" /></button>}
      <div className="card-image">
        <img src={logoImg} />
      </div>
      <h2> {name == 'wiki' ? 'docs' : name}</h2>
    </article>


  )

}




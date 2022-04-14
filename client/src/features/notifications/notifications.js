import React from 'react'
import store from '../../app/store'
import { getSpace, getProposals, didAddressVote } from '../../helpers/snapshot_api'
import { listEvents } from '../../helpers/google-calendar'
import Notify from 'bnc-notify'
import {
  setWidgetNotification,
} from '../dashboard/dashboard-widgets-reducer';


const notifyOptions = {
  networkId: 1,
  darkMode: true, // (default: false)
  mobilePosition: 'bottom', // 'top', 'bottom' (default: 'top')
  desktopPosition: 'bottomRight', // 'bottomLeft', 'bottomRight', 'topLeft', 'topRight' (default: 'bottomRight')
}

const notify = Notify(notifyOptions);

const showNotification = (eventCode, type, message) => {
  const { update, dismiss } = notify.notification({eventCode: eventCode, type: type, message: message})
}

async function querySnapshot(ens, walletAddress){
  var missedVotes = await didAddressVote(ens, walletAddress);
  console.log(missedVotes)
  if(missedVotes.length > 0){
    store.dispatch(setWidgetNotification('snapshot'))
  }
}

async function queryCalendar(calendarId){
  const events = await listEvents(calendarId, 5)
  if(events.data.data.items.length > 0){
    store.dispatch(setWidgetNotification('calendar'))
  }

}


async function fetchNotifications(){
  const { dashboardWidgets, connectivity } = store.getState();
  for (var i in dashboardWidgets.visibleWidgets){
    // query snapshot data
    if(dashboardWidgets.visibleWidgets[i].name == 'snapshot'){
      querySnapshot(dashboardWidgets.visibleWidgets[i].ens, connectivity.address);
    }
    if(dashboardWidgets.visibleWidgets[i].name == 'calendar'){
      queryCalendar(dashboardWidgets.visibleWidgets[i].link);
    }

  }
}

export { fetchNotifications, showNotification }

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import store from '../../app/store.js'


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
  populateOrganizations,
} from '../org-cards/org-cards-reducer';

import {
  populateInitialWidgets,
  selectInstalledWidgets,
  selectInstallableWidgets,
  populateVisibleWidgets,
  selectVisibleWidgets,
  updateWidgets,
  setInstalledWidgets,
  setInstallableWidgets,
} from '../dashboard/dashboard-widgets-reducer';

import {
  selectDashboardInfo,
  populateDashboardInfo,
  increaseMemberCount,
  decreaseMemberCount,
  populateInfo,
} from '../dashboard/dashboard-info-reducer'

import {
  populateDashboardRules,
  selectDashboardRules,
  applyDashboardRules,
  selectDashboardRuleResults,
  setDashboardRules,
} from '../gatekeeper/gatekeeper-rules-reducer'
import { showNotification } from '../notifications/notifications.js';


export const batchFetchDashboardData = async (ens, info, dispatch) => {
  if (info.ens !== ens) {
    const resp = await axios.get('/dashboardBatchData/' + ens)
    dispatch(populateInfo(resp.data.dashboardData.orgInfo))
    dispatch(setDashboardRules(resp.data.dashboardData.rules))
    dispatch(setInstalledWidgets(resp.data.dashboardData.widgets.installed))
    dispatch(setInstallableWidgets(resp.data.dashboardData.widgets.installable))
  }
}

export const fetchOrganizations = async (cardsPulled, dispatch) => {
  if (!cardsPulled) {
    var orgs = await axios.get('/organizations');
    dispatch(populateOrganizations(orgs.data))
  }
}

export const fetchUserMembership = async (walletAddress, membershipPulled, dispatch) => {
  if (!membershipPulled && walletAddress) {
    dispatch(populateInitialMembership(walletAddress));
  }
}

export const authenticated_post = async (endpoint, body) => {
  try {
    let res = await axios.post(endpoint, body, { headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` } })
    return res
  } catch (e) {
    showNotification('hint', 'hint', 'please connect your wallet')
  }

}
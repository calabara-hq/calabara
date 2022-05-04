import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import store from '../../app/store.js'


import {
  selectConnectedBool,
  selectConnectedAddress,
  setIsTokenExpired
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
import { auxillaryConnect, signMessage } from '../wallet/wallet.js';


export const batchFetchDashboardData = async (ens, info, dispatch) => {
  if (info.ens !== ens) {
    const resp = await axios.get('/dashboard/dashboardBatchData/' + ens)
    dispatch(populateInfo(resp.data.dashboardData.orgInfo))
    dispatch(setDashboardRules(resp.data.dashboardData.rules))
    dispatch(setInstalledWidgets(resp.data.dashboardData.widgets.installed))
    dispatch(setInstallableWidgets(resp.data.dashboardData.widgets.installable))
  }
}

export const fetchOrganizations = async (cardsPulled, dispatch) => {
  if (!cardsPulled) {
    var orgs = await axios.get('/organizations/organizations');
    dispatch(populateOrganizations(orgs.data))
  }
}

export const fetchUserMembership = async (walletAddress, membershipPulled, dispatch) => {
  if (!membershipPulled && walletAddress) {
    dispatch(populateInitialMembership(walletAddress));
  }
}

export const authenticated_post = async (endpoint, body, dispatch, jwt) => {

  try {
    let res = await axios.post(endpoint, body, { headers: { 'Authorization': `Bearer ${jwt || localStorage.getItem('jwt')}` } })
    return res
  } catch (e) {
    switch (e.response.status) {
      case 401:
        dispatch(setIsTokenExpired(true))
        showNotification('hint', 'hint', 'please connect your wallet')

        // if wallet isn't connected, lets ask them to connect and retry
        let connect_res = await auxillaryConnect();
        if (connect_res) {
          let sig_res = await secure_sign(connect_res, dispatch);
          if (sig_res) return authenticated_post(endpoint, body, dispatch, sig_res)
        }
        break;
      case 403:
        showNotification('error', 'error', 'this wallet is not an organization admin')
        break;
    }
    return null
  }

}

// once a user has connected, check their jwt. 
// if jwt is expired or null, send request to server with wallet address.
// on the server, generate & store a random nonce and return it 
// ask the user to sign a message with the nonce
// send the signature back to the server
// send the user a jwt and store it    


export const secure_sign = async (walletAddress, dispatch) => {
  const nonce_from_server = await axios.post('/authentication/generate_nonce', { address: walletAddress })
  console.log(nonce_from_server)
  try {
    const signatureResult = await signMessage(nonce_from_server.data.nonce);
    console.log(signatureResult)

    try {
      let jwt_result = await axios.post('/authentication/generate_jwt', { sig: signatureResult.sig, address: walletAddress })
      console.log(jwt_result)
      dispatch(setIsTokenExpired(false))
      localStorage.setItem('jwt', jwt_result.data.jwt)
      return jwt_result.data.jwt
    } catch (e) {
      return null
    }
  } catch (err) {
    if (err.code === 4001) {
      showNotification('error', 'error', 'User denied signature request')
    }
    else {
      showNotification('error', 'error', 'Metamask error')
    }
    return null;
  }
}
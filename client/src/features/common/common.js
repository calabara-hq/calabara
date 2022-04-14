import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

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

import { selectDiscordId } from '../user/user-reducer';

export const batchFetchDashboardData = async (ens, dispatch) => {
    const resp = await axios.get('/dashboardBatchData/' + ens)
    dispatch(populateInfo(resp.data.dashboardData.orgInfo))
    dispatch(setDashboardRules(resp.data.dashboardData.rules))
    dispatch(setInstalledWidgets(resp.data.dashboardData.widgets.installed))
    dispatch(setInstallableWidgets(resp.data.dashboardData.widgets.installable))
  }

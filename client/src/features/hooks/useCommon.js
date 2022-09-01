import axios from 'axios';
import { useDispatch } from 'react-redux';

import { populateInfo } from '../dashboard/dashboard-info-reducer';
import { setDashboardRules } from '../gatekeeper/gatekeeper-rules-reducer';
import { setInstallableWidgets, setInstalledWidgets } from '../dashboard/dashboard-widgets-reducer';
import { populateOrganizations } from '../org-cards/org-cards-reducer';
import { setIsTokenExpired } from '../wallet/wallet-reducer';
import { showNotification } from '../notifications/notifications';
import useWallet from './useWallet';

export default function useCommon() {
    const dispatch = useDispatch();
    const { secure_sign, walletConnect } = useWallet();

    const batchFetchDashboardData = async (ens, info) => {
        if (info.ens !== ens) {
            const resp = await axios.get('/dashboard/dashboardBatchData/' + ens)
            dispatch(populateInfo(resp.data.dashboardData.orgInfo))
            dispatch(setDashboardRules(resp.data.dashboardData.rules))
            dispatch(setInstalledWidgets(resp.data.dashboardData.widgets.installed))
            dispatch(setInstallableWidgets(resp.data.dashboardData.widgets.installable))
        }
    }

    const fetchOrganizations = async (cardsPulled) => {
        if (!cardsPulled) {
            var orgs = await axios.get('/organizations/organizations');
            dispatch(populateOrganizations(orgs.data))
        }
    }

    const authenticated_post = async (endpoint, body, jwt) => {


        try {
            let res = await axios.post(endpoint, body, { headers: { 'Authorization': `Bearer ${jwt || localStorage.getItem('jwt')}` } })
            return res
        } catch (e) {
            switch (e.response.status) {
                case 401:
                    dispatch(setIsTokenExpired(true))
                    showNotification('hint', 'hint', 'please connect your wallet')

                    // if wallet isn't connected, lets ask them to connect and retry
                    let connect_res = await walletConnect();
                    if (connect_res) {
                        let sig_res = await secure_sign(connect_res);
                        if (sig_res) return authenticated_post(endpoint, body, sig_res)
                    }
                    break;
                case 403:
                    showNotification('error', 'error', 'this wallet is not an organization admin')
                    break;
                case 419:
                    showNotification('error', 'error', 'this wallet does not meet submission requirements')
                    break;
                case 432:
                    showNotification('error', 'error', 'this contest is not accepting submissions at this time')
                    break;
                case 433:
                    showNotification('error', 'error', 'this contest is not accepting votes at this time')
                    break;
            }
            return null
        }

    }

    return {
        batchFetchDashboardData: (ens, info) => {
            batchFetchDashboardData(ens, info)
        },
        fetchOrganizations: (cardsPulled) => {
            fetchOrganizations(cardsPulled)
        },
        authenticated_post: async (endpoint, body, jwt) => {
            return await authenticated_post(endpoint, body, jwt)
        }
    }

}
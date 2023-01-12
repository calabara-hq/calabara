import axios from 'axios';
import { useDispatch } from 'react-redux';

import { populateInfo } from '../dashboard/dashboard-info-reducer';
import { setDashboardRules } from '../gatekeeper/gatekeeper-rules-reducer';
import { setInstallableWidgets, setInstalledWidgets } from '../dashboard/dashboard-widgets-reducer';
import { populateOrganizations } from '../org-cards/org-cards-reducer';
import { showNotification } from '../notifications/notifications';
import { useWalletContext } from '../../app/WalletContext';

import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function useCommon() {
    const dispatch = useDispatch();
    const { openConnectModal } = useConnectModal()
    const { secure_sign, walletConnect } = useWalletContext();

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

    return {
        batchFetchDashboardData: (ens, info) => {
            batchFetchDashboardData(ens, info)
        },
        fetchOrganizations: (cardsPulled) => {
            fetchOrganizations(cardsPulled)
        }
    }

}
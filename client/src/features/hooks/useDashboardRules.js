import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { selectDashboardRules, setDashboardRules, setDashboardResults } from "../gatekeeper/gatekeeper-rules-reducer"
import { selectConnectedAddress, selectConnectedBool } from "../wallet/wallet-reducer";
import { selectDiscordId } from "../user/user-reducer";
import useGatekeeper from "./useGatekeeper";

export default function useDashboardRules() {
    const dashboardRules = useSelector(selectDashboardRules);
    const walletAddress = useSelector(selectConnectedAddress);
    const {queryGatekeeper} = useGatekeeper();
    const isConnected = useSelector(selectConnectedBool);
    const discordId = useSelector(selectDiscordId);
    const dispatch = useDispatch();

    const populateDashboardRules = async (ens) => {
        const res = await axios.get('/dashboard/dashboardRules/' + ens);
        dispatch(setDashboardRules(res.data))
    }

    const applyDashboardRules = async (walletAddress) => {

        if (!isConnected) {
            // wallet not connected, clear rule results
            dispatch(setDashboardResults({}))
        }

        else {
            let ruleTestResults = {}
            Object.entries(dashboardRules).map(([key, value]) => {
                ruleTestResults[key] = "";

            })
            const result = await queryGatekeeper(walletAddress, dashboardRules, ruleTestResults, discordId)
            console.log(result)
            dispatch(setDashboardResults(result))
        }
    }

    return {
        populateDashboardRules: async (ens) => {
            await populateDashboardRules(ens)
        },

        applyDashboardRules: async (walletAddress) => {
            await applyDashboardRules(walletAddress)
        }
    }
}
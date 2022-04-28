import { createSlice } from '@reduxjs/toolkit';
import { queryGatekeeper } from './gatekeeper.js'

export const gatekeeperRules = createSlice({
  name: 'gatekeeperRules',
  initialState: {
    dashboardRules: {},
    ruleResults: {},
  },
  reducers: {

    setDashboardRules: (state, data) => {
      state.dashboardRules = data.payload;
    },

    setDashboardResults: (state, data) => {
      state.ruleResults = data.payload;
    },


  },
});




export const { setDashboardRules, setDashboardResults } = gatekeeperRules.actions;
export const selectDashboardRules = state => state.gatekeeperRules.dashboardRules;
export const selectDashboardRuleResults = state => state.gatekeeperRules.ruleResults;


export const populateDashboardRules = (ens) => async (dispatch, getState, axios) => {

  const res = await axios.get('/dashboard/dashboardRules/' + ens);

  dispatch(setDashboardRules(res.data))
}

export const applyDashboardRules = (walletAddress) => async (dispatch, getState, axios) => {

  let { gatekeeperRules, connectivity, user } = getState();

  if (!connectivity.connected) {
    // wallet not connected, clear rule results
    dispatch(setDashboardResults({}))
  }

  else {
    let ruleTestResults = {}
    Object.entries(gatekeeperRules.dashboardRules).map(([key, value]) => {
      ruleTestResults[key] = "";

    })
    const result = await queryGatekeeper(walletAddress, gatekeeperRules.dashboardRules, ruleTestResults, user.discord_id)
    dispatch(setDashboardResults(result))
  }
}





export default gatekeeperRules.reducer;

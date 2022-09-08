import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboardRules: {},
  ruleResults: {},
}


export const gatekeeperRules = createSlice({
  name: 'gatekeeperRules',
  initialState,
  reducers: {

    setDashboardRules: (state, data) => {
      state.dashboardRules = data.payload;
    },

    setDashboardResults: (state, data) => {
      state.ruleResults = data.payload;
    },

    gatekeeperReset: () => initialState

  },
});




export const { setDashboardRules, setDashboardResults, gatekeeperReset } = gatekeeperRules.actions;
export const selectDashboardRules = state => state.gatekeeperRules.dashboardRules;
export const selectDashboardRuleResults = state => state.gatekeeperRules.ruleResults;

export default gatekeeperRules.reducer;

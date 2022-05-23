import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  info: {
    name: "",
    ens: "",
    logo: "",
    members: "",
    website:"",
    discord: "",
    verified: "",
    addresses: [],
  }, 
}

export const dashboardInfo = createSlice({
  name: 'dashboardInfo',
  initialState,
  reducers: {

    populateInfo: (state, data) => {
      state.info = data.payload;
    },

    increaseMemberCount: (state, data) => {
      state.info.members += 1;
    },

    decreaseMemberCount: (state, data) => {
      state.info.members -= 1;
    },

    dashboardInfoReset: () => initialState
  },
});


export const { populateInfo, increaseMemberCount, decreaseMemberCount, dashboardInfoReset } = dashboardInfo.actions;
export const selectDashboardInfo = state => state.dashboardInfo.info;
export const selectDashboardMemberCount = state => state.dashboardInfo.info.members;

export default dashboardInfo.reducer;

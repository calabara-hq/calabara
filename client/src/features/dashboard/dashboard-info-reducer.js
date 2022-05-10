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



export const populateDashboardInfo = (ens) => async (dispatch, getState, axios) => {

  const res = await axios.get('/dashboard/dashboardInfo/' + ens);
  dispatch(populateInfo(res.data.orgInfo))
}

export const updateDashboardInfo = (params) => async (dispatch, getState, axios) => {

  const {dashboardInfo} = getState();

  let infoCopy = JSON.parse(JSON.stringify(dashboardInfo.info));

  infoCopy = Object.assign(infoCopy, params)
  dispatch(populateInfo(infoCopy))
}




export default dashboardInfo.reducer;

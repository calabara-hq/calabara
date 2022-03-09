import { createSlice } from '@reduxjs/toolkit';


export const dashboardInfo = createSlice({
  name: 'dashboardInfo',
  initialState: {
    info: {
      name: "",
      ens: "",
      logo: "",
      members: "",
      website:"",
      discord: "",
      verified: "",
      addresses: [],
      
    }
  },
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
  },
});


export const { populateInfo, increaseMemberCount, decreaseMemberCount } = dashboardInfo.actions;
export const selectDashboardInfo = state => state.dashboardInfo.info;



export const populateDashboardInfo = (ens) => async (dispatch, getState, axios) => {

  const res = await axios.get('/dashboardInfo/' + ens);
  console.log(res)
  dispatch(populateInfo(res.data.orgInfo))
}

export const updateDashboardInfo = (params) => async (dispatch, getState, axios) => {
  console.log('here!!!')

  const {dashboardInfo} = getState();
  console.log(params)

  let infoCopy = JSON.parse(JSON.stringify(dashboardInfo.info));

  infoCopy = Object.assign(infoCopy, params)
  dispatch(populateInfo(infoCopy))
}




export default dashboardInfo.reducer;

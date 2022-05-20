import { createSlice } from '@reduxjs/toolkit';


// installed widgets --> all widgets this org has installed on their dashboard
// installable widgets --> supported widgets - installed widgets for an org dashboard
// visibleWidgets --> subset of installed widgets that is different depending on the result of the gatekeeper check

const initialState = {
  installedWidgets: [],
  installableWidgets: [],
  visibleWidgets: []
}

export const dashboardWidgets = createSlice({
  name: 'dashboardWidgets',
  initialState,
  reducers: {

    setInstalledWidgets: (state, data) => {
      state.installedWidgets = data.payload;
    },

    setInstallableWidgets: (state, data) => {
      state.installableWidgets = data.payload;
    },

    setVisibleWidgets: (state, data) => {
      state.visibleWidgets = data.payload;
    },

    // takes an index as argument
    setNotification: (state, data) => {
      state.visibleWidgets[data.payload].notify = 1;
    },

    dashboardWidgetsReset: () => initialState


  },
});

export const { setInstalledWidgets, setInstallableWidgets, setVisibleWidgets, setNotification, dashboardWidgetsReset } = dashboardWidgets.actions;

export const selectInstalledWidgets = state => state.dashboardWidgets.installedWidgets;
export const selectInstallableWidgets = state => state.dashboardWidgets.installableWidgets;
export const selectVisibleWidgets = state => state.dashboardWidgets.visibleWidgets;




export default dashboardWidgets.reducer;

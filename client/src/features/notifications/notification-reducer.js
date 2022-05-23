import { createSlice } from '@reduxjs/toolkit';

export const notificationReducer = createSlice({
  name: 'notifications',
  initialState: {
    subscribed:[],

  },
  reducers: {

    subscribe: (state, data) => {
      
      state.subscribed.push(data.payload)
    },

    leave: (state, data) => {
      state.subscribed.push(data.payload)
    },


  },
});

export const { subscribe } = notificationReducer.actions;
export const selectSubscribed = state => state.notifications.subscribed;



export default notificationReducer.reducer;

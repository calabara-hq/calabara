import { createSlice } from '@reduxjs/toolkit';


export const connectivity = createSlice({
  name: 'connectivity',
  initialState: {
    connected: false,
    address: '',
  },
  reducers: {

    setConnected: (state, data) => {
      state.address = data.payload;
      state.connected = true;
    },

    setDisconnected: (state, data) => {
      state.address = '';
      state.connected = false;
    },

  },
});

export const { setConnected, setDisconnected, setAccountChange } = connectivity.actions;



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectConnectedBool = state => state.connectivity.connected;
export const selectConnectedAddress = state => state.connectivity.address;

export default connectivity.reducer;

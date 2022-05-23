import { createSlice } from '@reduxjs/toolkit';


export const connectivity = createSlice({
  name: 'connectivity',
  initialState: {
    connected: false,
    address: '',
    account_change: false,
    is_token_expired: false
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

    setAccountChange: (state, data) => {
      state.account_change = data.payload;
    },

    setIsTokenExpired: (state, data) => {
      state.is_token_expired = data.payload;
    }

  },
});

export const { setConnected, setDisconnected, setAccountChange, setIsTokenExpired } = connectivity.actions;



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectConnectedBool = state => state.connectivity.connected;
export const selectConnectedAddress = state => state.connectivity.address;
export const selectAccountChange = state => state.connectivity.account_change;
export const selectIsTokenExpired = state => state.connectivity.is_token_expired;

export const manageAccountChange = (newAddress) => async (dispatch, getState, axios) => {
  let { connectivity } = getState();

  if(connectivity.address !== '' && newAddress){
    // account changed, not just normal log in/log out flow
    dispatch(setDisconnected())
    dispatch(setAccountChange(true))
    
  }

 
  
}


export default connectivity.reducer;

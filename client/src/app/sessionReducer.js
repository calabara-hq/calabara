import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    userSession: false,
}

export const session = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setUserSession: (state, data) => {
            state.userSession = data.payload;
        },
        clearSession: () => initialState
    },
});

export const { setUserSession, clearSession } = session.actions;
export const selectUserSession = state => state.session.userSession;
export const selectIsConnected = state => state.session.userSession ? true : false;
export const selectWalletAddress = state => state.session.userSession ? state.session.userSession.address : null;
export const selectIsAuthenticated = state => state.session.userSession ? 'authenticated' : 'unauthenticated'


export default session.reducer;
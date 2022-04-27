import { createSlice } from '@reduxjs/toolkit';


export const user = createSlice({
    name: 'user',
    initialState: {
        discord_id: null,
    },
    reducers: {
        setDiscordId: (state, data) => {
            state.discord_id = data.payload;
        },
        setNonce: (state, data) => {
            state.nonce = data.payload;
        },
    },
});

export const { setDiscordId, setNonce } = user.actions;
export const selectDiscordId = state => state.user.discord_id;


export const registerUser = (walletAddress) => async (dispatch, axios) => {
    const result = await axios.post('/registerUser', { address: walletAddress });
    if (result.data.discordId === 'null') {
        dispatch(setDiscordId(null))
    }
    else {
        dispatch(setDiscordId(result.data.discordId))
    }
}



export default user.reducer;

import { createSlice } from '@reduxjs/toolkit';


export const user = createSlice({
    name: 'user',
    initialState: {
        discord_id: null
    },
    reducers: {
        setDiscordId: (state, data) => {
            state.discord_id = data.payload;
        },
    },
});

export const { setDiscordId } = user.actions;
export const selectDiscordId = state => state.user.discord_id;


export const registerUser = (walletAddress) => async (dispatch, getState, axios) => {
    const discord_id = await axios.post('/registerUser', { address: walletAddress });
    if (discord_id.data == '') {
        dispatch(setDiscordId(null))
    }
    else {
        dispatch(setDiscordId(discord_id.data))

    }
}



export default user.reducer;

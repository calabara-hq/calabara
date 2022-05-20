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
    },
});

export const { setDiscordId, setNonce } = user.actions;
export const selectDiscordId = state => state.user.discord_id;

export default user.reducer;

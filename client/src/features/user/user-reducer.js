import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    discord_id: null,
    twitter: null
}
export const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setDiscordId: (state, data) => {
            state.discord_id = data.payload;
        },

        setUserTwitter: (state, data) => {
            state.twitter = data.payload
        },
        destroyTwitter: () => initialState
    },
});

export const { setDiscordId, setUserTwitter, destroyTwitter } = user.actions;
export const selectDiscordId = state => state.user.discord_id;
export const selectUserTwitter = state => state.user.twitter;
export const selectIsTwitterLinked = state => state.user.twitter !== null;
export default user.reducer;

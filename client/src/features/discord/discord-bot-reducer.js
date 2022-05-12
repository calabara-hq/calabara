import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null
}


export const discordBotData = createSlice({
  name: 'discordBotData',
  initialState,
  reducers: {

    setDiscordBotData: (state, data) => {
      state.data = data.payload;
    },

    discordBotDataReset: () => initialState

  },
});


export const { setDiscordBotData, discordBotDataReset } = discordBotData.actions;
export const selectDiscordBotData = state => state.discordBotData.discordBotData;


export default discordBotData.reducer;

import { createSlice } from '@reduxjs/toolkit';

export const wiki_data = createSlice({
  name: 'wiki_data',
  initialState: {
    wikiList: {
    },
    organization: {

    },
  },
  reducers: {

    setWikiList: (state, data) => {
      state.wikiList = data.payload;
    },

    addToWikiList: (state, data) => {
      state.wikiList[data.payload.group_id] = data.payload.value;
    },

    setEns: (state, data) => {
      state.organization.ens = data.payload;
    }


  },
});

export const { setWikiList, addToWikiList, setEns } = wiki_data.actions;
export const selectWikiList = state => state.wiki_data.wikiList;
export const selectWikiListOrganization = state => state.wiki_data.organization;

export default wiki_data.reducer;

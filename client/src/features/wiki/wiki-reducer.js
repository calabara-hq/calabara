import { createSlice } from '@reduxjs/toolkit';

export const wiki_data = createSlice({
  name: 'wiki_data',
  initialState: {
    wikiList: {
      /*
      ens: ens,
      groupings: {}
      public: {
        gk_rules: {},
        list: [{id: "85", name: 'test', prefix: 'public'}]
      },
      erc20pass: {
        gk_rules: {
          632: 70,
        },
        list: [{id: "88", name: "test666", prefix: 'erc20pass'}]
      },
      erc721pass: {
        gk_rules: {
          630: 90,
        },
        list: [{id: "87", name: "untitled", prefix: 'erc721pass'}]
      },
      */
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

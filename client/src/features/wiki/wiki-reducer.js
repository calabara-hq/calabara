import { createSlice } from '@reduxjs/toolkit';


export const wiki_data = createSlice({
  name: 'wiki_data',
  initialState: {
    wikiList:{
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
    organization:{
      
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

export const {setWikiList, addToWikiList, setEns} = wiki_data.actions;
export const selectWikiList = state => state.wiki_data.wikiList;
export const selectWikiListOrganization = state => state.wiki_data.organization;





export const deleteWiki = (id, grouping, index) => async (dispatch, getState, axios) => {

  const { wiki_data } = getState();

  let listCopy = JSON.parse(JSON.stringify(wiki_data.wikiList));

  listCopy[grouping].list.splice(index, 1);
  dispatch(setWikiList(listCopy))
  await axios.post('/deleteWiki/', {file_id: id});


}

export const populateInitialWikiList = (ens) => async (dispatch, getState, axios) => {
  const result = await axios.get('/fetchWikis/' + ens)
  
  dispatch(setEns(ens))
  dispatch(setWikiList(result.data))

}

export const removeFromWikiList = (groupID) => async (dispatch, getState, axios) => {

  const { wiki_data } = getState();

  let listCopy = JSON.parse(JSON.stringify(wiki_data.wikiList))
  delete listCopy[groupID]


  dispatch(setWikiList(listCopy))

}


export const updateWikiList = (newList) => async (dispatch, getState, axios) => {

  dispatch(setWikiList(newList))

}

export const renameWikiList = (newList) => async (dispatch, getState, axios) => {

  const { wiki_data } = getState();

  let listCopy = JSON.parse(JSON.stringify(wiki_data.wikiList))

  
  


  listCopy[newList.group_id] = newList.value;

  dispatch(setWikiList(listCopy))

}





export default wiki_data.reducer;

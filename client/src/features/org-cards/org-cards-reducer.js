import { createSlice } from '@reduxjs/toolkit';

// keep a list of orgs this user is a member of

export const organizations = createSlice({
  name: 'organizations',
  initialState: {
    memberOf: [],
    membershipPulled: false,
    cards: [],
    cardsPulled: false,
    logoCache: {},
  },
  reducers: {

    join: (state, data) => {
      state.memberOf.push(data.payload)
    },

    populateMembership: (state, data) => {
      state.memberOf = data.payload
      state.membershipPulled = true;
    },

    addOrganization: (state, data) => {
      state.cards.push(data.payload)
    },

    populateOrganizations: (state, data) => {
      state.cards = data.payload;
      state.cardsPulled = true;
    },

    // cache the explore page logos
    populateLogoCache: (state, data) =>{
      state.logoCache[data.payload.imageURL] = data.payload.blob
    }

  },
});

export const { join, populateMembership, populateOrganizations, addOrganization, populateLogoCache } = organizations.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

export const isMember = ens => (dispatch, getState) => {
  const { organizations } = getState();
  var result = Boolean(organizations.memberOf.find(el => { return el === ens }))
  return result

}

export const deleteMembership = (walletAddress, ens) => async (dispatch, getState, axios) => {


  const { organizations } = getState();
  var newData = JSON.parse(JSON.stringify(organizations.memberOf))
  const toDelete = (el) => el == ens;
  const toDeleteIndex = newData.findIndex(toDelete)
  newData.splice(toDeleteIndex, 1)
  dispatch(populateMembership(newData))
  await axios.post('/organizations/removeSubscription/', { address: walletAddress, ens: ens });


}


export const deleteOrganization = (ens) => async (dispatch, getState, axios) => {
  const { organizations } = getState();
  var cardsCopy = JSON.parse(JSON.stringify(organizations['cards']));

  for (var i in cardsCopy) {
    if (cardsCopy[i].ens == ens) {
      cardsCopy.splice(i, 1)
      break;
    }
  }
  dispatch(populateOrganizations(cardsCopy))
}

export const populateInitialMembership = (walletAddress) => async (dispatch, getState, axios) => {

  var subs = await axios.get('/organizations/getSubscriptions/' + walletAddress);
  dispatch(populateMembership(subs.data))

}

export const addMembership = (walletAddress, ens) => async (dispatch, getState, axios) => {

  var subs = await axios.post('/organizations/addSubscription/', { address: walletAddress, ens: ens });
  dispatch(join(ens))

}



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectMemberOf = state => state.organizations.memberOf;
export const selectOrganizations = state => state.organizations.cards;
export const selectCardsPulled = state => state.organizations.cardsPulled;
export const selectMembershipPulled = state => state.organizations.membershipPulled;
export const selectLogoCache = state => state.organizations.logoCache;


export default organizations.reducer;

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
    populateLogoCache: (state, data) => {
      state.logoCache[data.payload.imageURL] = data.payload.blob
    }

  },
});

export const { join, populateMembership, populateOrganizations, addOrganization, populateLogoCache } = organizations.actions;

export const selectMemberOf = state => state.organizations.memberOf;
export const selectOrganizations = state => state.organizations.cards;
export const selectCardsPulled = state => state.organizations.cardsPulled;
export const selectMembershipPulled = state => state.organizations.membershipPulled;
export const selectLogoCache = state => state.organizations.logoCache;


export default organizations.reducer;

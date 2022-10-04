import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    submitter_restrictions: [],
    voter_restrictions: [],
    sub_restriction_error_matrix: [],
    voter_restriction_error_matrix: []
}

export const contestParticipantRestrictions = createSlice({
    name: 'contestParticipantRestrictions',
    initialState,
    reducers: {

        initializeRestrictions: (state, data) => {
            state.submitter_restrictions = data.payload;
            state.voter_restrictions = data.payload;
            state.sub_restriction_error_matrix = Array(data.payload.length).fill(false);
            state.voter_restriction_error_matrix = Array(data.payload.length).fill(false)

        },

        setSubmitterRestrictions: (state, data) => {
            const { update_type, index, payload } = { ...data.payload }

            switch (update_type) {
                case 'enable':
                    state.submitter_restrictions[index].threshold = "";
                    break;
                case 'disable':
                    delete state.submitter_restrictions[index].threshold;
                    state.sub_restriction_error_matrix[index] = false;
                    break;
                case 'update':
                    state.submitter_restrictions[index].threshold = payload;
                    state.sub_restriction_error_matrix[index] = false;
                    break;
                case 'add':
                    state.submitter_restrictions.push(payload);
                    state.sub_restriction_error_matrix.push(false);
                    break;
                case 'error':
                    state.sub_restriction_error_matrix[index] = true;
            }

        },

        setVoterRestrictions: (state, data) => {
            const { update_type, index, payload } = { ...data.payload }
            switch (update_type) {
                case 'enable':
                    state.voter_restrictions[index].threshold = "";
                    break;
                case 'disable':
                    delete state.voter_restrictions[index].threshold;
                    state.voter_restriction_error_matrix[index] = false;
                    break;
                case 'update':
                    state.voter_restrictions[index].threshold = payload;
                    state.voter_restriction_error_matrix[index] = false;
                    break;
                case 'add':
                    state.voter_restrictions.push(payload);
                    state.voter_restriction_error_matrix.push(false);
                    break;
                case 'error':
                    state.voter_restriction_error_matrix[index] = true;
            }
        },

    }
});


const getSubmitterRestrictions = state => state.contestParticipantRestrictions.submitter_restrictions;
const getVoterRestrictions = state => state.contestParticipantRestrictions.voter_restrictions;
const getSubmitterRestrictionErrors = state => state.contestParticipantRestrictions.sub_restriction_error_matrix;
const getVoterRestrictionErrors = state => state.contestParticipantRestrictions.voter_restriction_error_matrix;

export default contestParticipantRestrictions.reducer



const {
    initializeRestrictions,
    setSubmitterRestrictions,
    setVoterRestrictions
} = contestParticipantRestrictions.actions


const initializeAvailableRules = (dashboardRules) => (dispatch, getState) => {
    let availableRules = [];
    Object.values(dashboardRules).map((val, index) => {
        if (val.type !== 'discord') {
            availableRules.push(val);
        }
    })
    dispatch(initializeRestrictions(availableRules))

}

export const availableRestrictionsActions = { initializeAvailableRules }

export const submitterRestrictionsActions = { setSubmitterRestrictions }
export const submitterRestrictionsState = { getSubmitterRestrictions, getSubmitterRestrictionErrors }

export const voterRestrictionsActions = { setVoterRestrictions }
export const voterRestrictionsState = { getVoterRestrictions, getVoterRestrictionErrors }
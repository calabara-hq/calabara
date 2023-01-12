import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contest_state: null,
    contest_settings: null,
    prompt_data: null,
    durations: [null, null, null],
    progress_ratio: null,
    loading: true,
    total_voting_power: null,
    remaining_voting_power: null,
    submission_state: null
}


export const contestState = createSlice({
    name: 'contestState',
    initialState,
    reducers: {

        setContestSettings: (state, data) => {
            state.contest_settings = data.payload
        },

        setPromptData: (state, data) => {
            state.prompt_data = data.payload
        },

        setLoading: (state, data) => {
            state.loading = data.payload
        },

        updateState: (state, data) => {
            state.durations = data.payload.durations
            state.progress_ratio = data.payload.progress_ratio
            state.contest_state = data.payload.contest_state
            state.loading = false
        },

        setTotalVotingPower: (state, data) => {
            state.total_voting_power = data.payload
        },

        setRemainingVotingPower: (state, data) => {
            state.remaining_voting_power = data.payload
        },

        stateReset: () => initialState

    },
});




export const { setContestSettings, setPromptData, setLoading, updateState, setTotalVotingPower, setRemainingVotingPower, stateReset } = contestState.actions;
export const selectContestState = state => state.contestState.contest_state;
export const selectDurations = state => state.contestState.durations;
export const selectProgressRatio = state => state.contestState.progress_ratio;
export const selectContestHash = state => state.contestState.contest_hash;
export const selectContestSettings = state => state.contestState.contest_settings;
export const selectPromptData = state => state.contestState.prompt_data;
export const selectIsLoading = state => state.contestState.loading;
export const selectTotalVotingPower = state => state.contestState.total_voting_power;
export const selectRemainingVotingPower = state => state.contestState.remaining_voting_power;
export const selectSubmissionState = state => state.contestState.submission_state;



export default contestState.reducer;

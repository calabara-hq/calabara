import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contest_state: null,
    contest_settings: null,
    prompt_data: null,
    durations: [null, null, null],
    progress_ratio: null,
    loading: true
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
            state.durations = data.payload.durations;
            state.progress_ratio = data.payload.progress_ratio
            state.contest_state = data.payload.contest_state
            state.loading = false
        },

        stateReset: () => initialState

    },
});




export const { setContestSettings, setPromptData, setLoading, updateState, stateReset } = contestState.actions;
export const selectContestState = state => state.contestState.contest_state;
export const selectDurations = state => state.contestState.durations;
export const selectProgressRatio = state => state.contestState.progress_ratio;
export const selectContestHash = state => state.contestState.contest_hash;
export const selectContestSettings = state => state.contestState.contest_settings;
export const selectPromptData = state => state.contestState.prompt_data;
export const selectIsLoading = state => state.contestState.loading;


export default contestState.reducer;

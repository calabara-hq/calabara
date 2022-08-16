import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contest_state: null,
    contest_hash: null,
    durations: [null, null, null],
    progress_ratio: 0,
}


export const contestState = createSlice({
    name: 'contestState',
    initialState,
    reducers: {

        setContestState: (state, data) => {
            state.contest_state = data.payload;
        },

        setDurations: (state, data) => {
            state.durations = data.payload;
        },

        setProgressRatio: (state, data) => {
            state.progress_ratio = data.payload;
        },

        setContestHash: (state, data) => {
            state.contest_hash = data.payload
        },

        stateReset: () => initialState

    },
});




export const { setContestState, setDurations, setProgressRatio, setContestHash } = contestState.actions;
export const selectContestState = state => state.contestState.contest_state;
export const selectDurations = state => state.contestState.durations;
export const selectProgressRatio = state => state.contestState.progress_ratio;
export const selectContestHash = state => state.contestState.contest_hash;

export default contestState.reducer;
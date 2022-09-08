import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    submitter_rewards: []
}

export const submitterRewards = createSlice({
    name: 'submitterRewards',
    initialState,
    reducers: {
        updateSubmitterRewards: (state, data) => {
            state.submitter_rewards[data.payload.index][data.payload.type] = data.payload.value
        },
        incrementWinners: (state, data) => {
            state.submitter_rewards.push({})
        },
        decrementWinners: (state, data) => {
            state.submitter_rewards.pop()
        },
        clearRewardOptions: () => initialState
    }
});

const submitterRewardActions = submitterRewards.actions;
const getSubmitterRewards = state => state.submitterRewards.submitter_rewards;
const getNumWinners = state => state.submitterRewards.submitter_rewards.length

let submitterRewardsState = {
    getSubmitterRewards,
    getNumWinners
}

export {
    submitterRewardActions,
    submitterRewardsState
}

export default submitterRewards.reducer
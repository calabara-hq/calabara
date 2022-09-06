import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    voter_rewards: [{}]
}

export const voterRewards = createSlice({
    name: 'voterRewards',
    initialState,
    reducers: {
        updatevoterRewards: (state, data) => {
            state.voter_rewards[data.payload.index] = data.payload.value
        },
        incrementWinners: (state, data) => {
            state.voter_rewards.push({})
        },
        decrementWinners: (state, data) => {
            state.voter_rewards.pop()
        },
        clearRewardOptions: () => initialState
    }
});

const voterRewardsActions = voterRewards.actions;
const getvoterRewards = state => state.voterRewards.voter_rewards;
const getNumWinners = state => state.voterRewards.voter_rewards.length

let voterRewardsState = {
    getvoterRewards,
    getNumWinners
}

export {
    voterRewardsActions,
    voterRewardsState
}

export default voterRewards.reducer
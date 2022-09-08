import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reward_options: {
        eth: {
            type: 'eth',
            symbol: 'ETH',
            img: 'eth',
            contract: null,
            selected: false
        }
    },
}

export const rewardOptions = createSlice({
    name: 'rewardOptions',
    initialState,
    reducers: {

        addReward: (state, data) => {
            if (state.reward_options[data.payload.type]) data.payload.selected = state.reward_options[data.payload.type].selected
            state.reward_options[data.payload.type] = data.payload

        },

        toggleSelectedReward: (state, data) => {
            state.reward_options[data.payload.type].selected = !(state.reward_options[data.payload.type].selected)
        },

        clearRewardOptions: () => initialState
    }
});

const rewardOptionsActions = rewardOptions.actions;
const getRewardOptions = state => state.rewardOptions.reward_options;
const getSelectedRewards = state => Object.fromEntries(Object.entries(state.rewardOptions.reward_options).filter(([key, value]) => value.selected === true));

let rewardOptionsState = {
    getRewardOptions,
    getSelectedRewards
}

export {
    rewardOptionsActions,
    rewardOptionsState
}

export default rewardOptions.reducer
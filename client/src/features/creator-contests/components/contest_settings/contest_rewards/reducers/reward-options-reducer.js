import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reward_options: {
        eth: {
            type: 'ETH',
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
            console.log('ADDING REWARD')
            //data.payload.selected = state.reward_options[data.payload.type].selected || false
            if (state.reward_options[data.payload.type]) data.payload.selected = state.reward_options[data.payload.type].selected 
            state.reward_options[data.payload.type] = data.payload
            /*
            state.selected_rewards[data.payload.type] ? selected = state.selected_rewards[data.payload.type] :
                state.reward_options[data.payload.type] = { ...data.payload, selected: state.reward_options[data.payload.type] || false }
            */
            //if user edited a selected reward, keep it selected
            // if (state.selected_rewards[data.payload.type]) data.payload.selected
        },

        setRewardSelected: (state, data) => {
            state.reward_options[data.payload.type].selected = true
        },

        clearRewardOptions: () => initialState
    }
});

const rewardOptionsActions = rewardOptions.actions;
const getRewardOptions = state => state.rewardOptions.reward_options;
const getSelectedRewards = state => state.rewardOptions.selected_rewards;

let rewardOptionsState = {
    getRewardOptions,
    getSelectedRewards
}

export {
    rewardOptionsActions,
    rewardOptionsState
}

export default rewardOptions.reducer
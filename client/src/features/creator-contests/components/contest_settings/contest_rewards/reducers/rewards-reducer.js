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
    submitter_rewards: [],
    voter_rewards: [],
    submitter_error_matrix: [],
    voter_error_matrix: []
}

export const contestRewards = createSlice({
    name: 'contestRewards',
    initialState,
    reducers: {

        addReward: (state, data) => {
            // if the reward was edited, keep the selected state from before
            if (state.reward_options[data.payload.type]) data.payload.selected = state.reward_options[data.payload.type].selected
            state.reward_options[data.payload.type] = data.payload
        },
        setSelectedReward: (state, data) => {
            state.reward_options[data.payload.type].selected = !(state.reward_options[data.payload.type].selected)
        },
        updateAllSubmitterRewards: (state, data) => {
            state.submitter_rewards = data.payload
        },
        updateSubmitterRewards: (state, data) => {
            state.submitter_rewards[data.payload.index][data.payload.type] = data.payload.value
            state.submitter_error_matrix[data.payload.index] = [false, false]
        },
        removeSubmitterReward: (state, data) => {
            state.submitter_rewards = [...state.submitter_rewards.slice(0, data.payload), ...state.submitter_rewards.slice(data.payload + 1)]
            state.submitter_error_matrix = [...state.submitter_error_matrix.slice(0, data.payload), ...state.submitter_error_matrix.slice(data.payload + 1)]
        },
        incrementSubmitterWinners: (state, data) => {
            state.submitter_rewards.push({})
            state.submitter_error_matrix.push([false, false])
        },

        updateVoterRewards: (state, data) => {
            state.voter_rewards[data.payload.index] = data.payload.value
            state.voter_error_matrix[data.payload.index] = [false, false]

        },
        removeVoterReward: (state, data) => {
            state.voter_rewards = [...state.voter_rewards.slice(0, data.payload), ...state.voter_rewards.slice(data.payload + 1)]
            state.voter_error_matrix = [...state.voter_error_matrix.slice(0, data.payload), ...state.voter_error_matrix.slice(data.payload + 1)]

        },
        incrementVoterWinners: (state, data) => {
            state.voter_rewards.push({})
            state.voter_error_matrix.push([false, false])

        },

        setSubmitterError: (state, data) => {
            state.submitter_error_matrix[data.payload.index] = data.payload.value
        },

        setVoterError: (state, data) => {
            state.voter_error_matrix[data.payload.index] = data.payload.value
        },

        clearRewardOptions: () => initialState,
        clearVoterRewards: (state) => {
            state.voter_rewards = []
        },
        clearSubmitterRewards: (state) => {
            state.submitter_rewards = []
        },
        clearSubmitterErrors: (state) => {
            state.submitter_error_matrix = []
        },
        clearVoterErrors: (state) => {
            state.voter_error_matrix = []
        }
    }
});

const getRewardOptions = state => state.contestRewards.reward_options;
const getSelectedRewards = state => Object.fromEntries(Object.entries(state.contestRewards.reward_options).filter(([key, value]) => value.selected === true));
const getSubmitterRewards = state => state.contestRewards.submitter_rewards;
const getVoterRewards = state => state.contestRewards.voter_rewards;
const getNumSubmissionWinners = state => state.contestRewards.submitter_rewards.length
const getNumVoterWinners = state => state.contestRewards.voter_rewards.length
const getSubmitterErrors = state => state.contestRewards.submitter_error_matrix;
const getVoterErrors = state => state.contestRewards.voter_error_matrix;


export default contestRewards.reducer

const {
    addReward,
    setSelectedReward,
    updateAllSubmitterRewards,
    updateSubmitterRewards,
    removeSubmitterReward,
    incrementSubmitterWinners,
    decrementSubmitterWinners,
    updateVoterRewards,
    removeVoterReward,
    incrementVoterWinners,
    clearRewardOptions,
    clearVoterRewards,
    clearSubmitterRewards,
    setSubmitterError,
    setVoterError,
    clearSubmitterErrors,
    clearVoterErrors
} = contestRewards.actions



const toggleSelectReward = (reward) => (dispatch, getState) => {
    const { contestRewards } = getState();
    const isCurrentlySelected = contestRewards.reward_options[reward.type].selected
    const selectedRewardsArray = Object.values(contestRewards.reward_options).filter((value) => value.selected === true)
    if (isCurrentlySelected) {
        if (selectedRewardsArray.length === 1) {
            // if we just flipped off the only selected reward, return everything to its initial state 
            dispatch(clearSubmitterRewards())
            dispatch(clearVoterRewards())
            dispatch(clearSubmitterErrors())
            dispatch(clearVoterErrors())

        }

        // remove reward from submitter / voter rewards
        else {
            let new_sub_rewards = contestRewards.submitter_rewards.map(el => {
                let { [reward.type]: remove, ...rest } = el
                return rest
            })
            dispatch(updateAllSubmitterRewards(new_sub_rewards))
        }

    }
    else {
        // not currently selected
        if (selectedRewardsArray.length === 0) {
            // if we just flipped on the only selected reward, push and empty object to the submitter array
            dispatch(incrementSubmitterWinners())
        }
    }

    dispatch(setSelectedReward(reward))

}


const toggleVoterRewards = () => (dispatch, getState) => {
    const { contestRewards } = getState();

    if (contestRewards.voter_rewards.length > 0) {
        // it's currently flipped on
        dispatch(clearVoterRewards())
        dispatch(clearVoterErrors())

    }
    else {
        // it's currently flipped off
        dispatch(incrementVoterWinners())

    }
}




export const rewardOptionActions = { addReward, toggleSelectReward, clearRewardOptions }
export const rewardOptionState = { getRewardOptions, getSelectedRewards }

export const submitterRewardActions = { updateSubmitterRewards, removeSubmitterReward, incrementSubmitterWinners, decrementSubmitterWinners, clearSubmitterRewards, setSubmitterError }
export const submitterRewardState = { getSubmitterRewards, getNumSubmissionWinners, getSubmitterErrors }

export const voterRewardActions = { updateVoterRewards, removeVoterReward, incrementVoterWinners, clearVoterRewards, toggleVoterRewards, setVoterError }
export const voterRewardState = { getVoterRewards, getNumVoterWinners, getVoterErrors }

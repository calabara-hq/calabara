import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitterRewardActions, submitterRewardState, voterRewardActions, voterRewardState } from './contest_rewards/reducers/rewards-reducer';



const check_rank_error = (rank) => {
    if (typeof rank === 'undefined') return 'Rank cannot be undefined. '
    if (rank === 0) return 'Rank cannot be undefined. '
    return false
}


const check_eth_error = (eth) => {
    if (typeof eth === 'undefined') return true
    if (typeof eth.amount === 'undefined') return true
    if (eth.amount === 0) return true
    return false
}

const check_erc20_error = (erc20) => {
    if (typeof erc20 === 'undefined') return true
    if (typeof erc20.amount === 'undefined') return true
    if (erc20.amount === 0) return true
    return false
}

const check_erc721_error = (erc721) => {
    if (typeof erc721 === 'undefined') return true
    if (typeof erc721.token_id === 'undefined') return true
    return false
}





export default function useErrorHandler() {
    const submitterRewards = useSelector(submitterRewardState.getSubmitterRewards)
    const voterRewards = useSelector(voterRewardState.getVoterRewards)
    const submitterErrors = useSelector(submitterRewardState.getSubmitterErrors);
    const voterErrors = useSelector(voterRewardState.getVoterErrors);
    const dispatch = useDispatch();



    const handleTimeBlockErrors = () => {
        
    }


    const handleSubmitterErrors = () => {
        let submitter_error = false;
        submitterRewards.map((reward, idx) => {
            let error_matrix = [];
            let { rank, eth, erc20, erc721 } = reward;
            let [rank_error, eth_error, erc20_error, erc721_error] = [check_rank_error(rank), check_eth_error(eth), check_erc20_error(erc20), check_erc721_error(erc721)]
            if (rank_error) { error_matrix[0] = rank_error; submitter_error = true }
            if (eth_error && erc20_error && erc721_error) {
                error_matrix[1] = 'At least one reward type must be defined'
                submitter_error = true
            }
            dispatch(submitterRewardActions.setSubmitterError({ index: idx, value: error_matrix }))

        })

        return submitter_error
    }

    const handleVoterErrors = () => {
        let voter_error = false;
        voterRewards.map((reward, idx) => {
            let error_matrix = []
            let { rank, eth, erc20 } = reward;
            let [rank_error, eth_error, erc20_error] = [check_rank_error(rank), check_eth_error(eth), check_erc20_error(erc20)]
            if (rank_error) { error_matrix[0] = rank_error; voter_error = true }
            if (eth && eth_error) { error_matrix[1] = 'Reward amount cannot be undefined'; voter_error = true }
            if (erc20 && erc20_error) { error_matrix[1] = 'Reward amount cannot be undefined'; voter_error = true }
            dispatch(voterRewardActions.setVoterError({ index: idx, value: error_matrix }))
        })

        return voter_error
    }





    const handleErrors = () => {
        return [handleSubmitterErrors(), handleVoterErrors()]
    }


    return {
        handleErrors
    }

}
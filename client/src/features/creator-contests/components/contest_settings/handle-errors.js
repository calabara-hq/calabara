import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitterRewardActions, submitterRewardState, voterRewardActions, voterRewardState } from './contest_rewards/reducers/rewards-reducer';
import { submitterRestrictionsActions, submitterRestrictionsState, voterRestrictionsActions, voterRestrictionsState } from './contest_gatekeeper/reducers/restrictions-reducer';


const check_rank_error = (rank) => {
    if (typeof rank === 'undefined') return 'Rank cannot be undefined. '
    if (rank === 0) return 'Rank cannot be undefined. '
    return false
}


const check_eth_error = (eth) => {
    if (typeof eth === 'undefined') return true
    if (typeof eth.amount === 'undefined') return true
    if (eth.amount === 0 || eth.amount === '') return true
    return false
}

const check_erc20_error = (erc20) => {
    if (typeof erc20 === 'undefined') return true
    if (typeof erc20.amount === 'undefined') return true
    if (erc20.amount === 0 || erc20.amount === '') return true
    return false
}

const check_erc721_error = (erc721) => {
    if (typeof erc721 === 'undefined') return true
    if (typeof erc721.token_id === 'undefined') return true
    if (erc721.token_id === '') return true
    return false
}





export default function useErrorHandler(date_times) {
    const submitterRewards = useSelector(submitterRewardState.getSubmitterRewards)
    const voterRewards = useSelector(voterRewardState.getVoterRewards)
    const submitter_restrictions = useSelector(submitterRestrictionsState.getSubmitterRestrictions);
    const voter_restrictions = useSelector(voterRestrictionsState.getVoterRestrictions);
    const dispatch = useDispatch();


    // compare the first date to the current date, in case user has been idle for a while.
    // if date_1 is less than the new date, update the state of current date to force a re-render of the timeblock to throw a visible error

    const handleTimeBlockErrors = (date_times) => {
        let setCurrentDate = date_times[0]
        let date_1 = date_times[1].toISOString();
        let date_2 = date_times[2].toISOString();
        let snapshot_date = date_times[3].toISOString();
        let now = new Date();
        if (date_1 < now.toISOString()) {
            setCurrentDate(now)
            return true
        }
        if (date_2 < date_1) return true
        if (snapshot_date > now.toISOString()) {
            setCurrentDate(now)
            return true
        }
        return false
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

    const handlePromptErrors = (editorData, promptBuilderData, setPromptBuilderData) => {
        let prompt_error = false;
        if (editorData.blocks.length === 0) {
            setPromptBuilderData({ type: 'update_single', payload: { prompt_content_error: true } })
            prompt_error = true
        }

        if (promptBuilderData.prompt_heading === '') {
            setPromptBuilderData({ type: 'update_single', payload: { prompt_heading_error: true } })
            prompt_error = true
        }
        if (promptBuilderData.prompt_label === '') {
            setPromptBuilderData({ type: 'update_single', payload: { prompt_label_error: true } })
            prompt_error = true
        }

        return prompt_error
    }


    const handleRestrictionErrors = () => {
        let restrictions_error = false;
        submitter_restrictions.map((val, idx) => {
            if (val.threshold === '') {
                dispatch(submitterRestrictionsActions.setSubmitterRestrictions({ index: idx, update_type: 'error', payload: null }))
                restrictions_error = true
            }
        })

        voter_restrictions.map((val, idx) => {
            if (val.threshold === '') {
                dispatch(voterRestrictionsActions.setVoterRestrictions({ index: idx, update_type: 'error', payload: null }))
                restrictions_error = true
            }
        })
        return restrictions_error
    }

    const handleVotingStrategyErrors = (votingStrategy, setVotingStrategyError) => {
        if (votingStrategy.strategy_id === 0) {
            setVotingStrategyError(true)
            return true
        }
        return false
    }


    // auth expired
    // tweet is empty
    const handleTwitterErrors = async (twitterData, setTwitterData) => {
        if (!twitterData.enabled) return false

        // verify auth state

        let isAuthenticated = await fetch('/twitter/verify_twitter_auth', { method: 'POST', credentials: 'include' })
            .then(res => {
                if (res.status === 200) {
                    return true
                }
                // set the error and revert back to stage 1 so user can re-auth
                setTwitterData({ type: 'update_single', payload: { error: 'invalid_auth', stage: 1 } })

                return false
            })

        if (!isAuthenticated) return true

        // check for empty content

        if (!twitterData.tweets[0].text) {
            setTwitterData({ type: 'update_single', payload: { error: 'empty_content' } })
            return true
        }

        for (const [idx, tweet] of twitterData.tweets.entries()) {
            if (tweet.text.length > 280) {
                setTwitterData({ type: 'update_single', payload: { error: 'char_overflow' } })
                setTwitterData({ type: 'focus_tweet', payload: idx })
                return true
            }
        }
        return false

    }

    return {
        handleSubmitterErrors: () => handleSubmitterErrors(),
        handleVoterErrors: () => handleVoterErrors(),
        handleTimeBlockErrors: (args) => handleTimeBlockErrors(args),
        handlePromptErrors: (editorData, promptBuilderData, setPromptBuilderData) => handlePromptErrors(editorData, promptBuilderData, setPromptBuilderData),
        handleRestrictionErrors: () => handleRestrictionErrors(),
        handleVotingStrategyErrors: (votingStrategy, setVotingStrategyError) => handleVotingStrategyErrors(votingStrategy, setVotingStrategyError),
        handleTwitterErrors: async (twitterData, setTwitterData) => await handleTwitterErrors(twitterData, setTwitterData)
    }

}
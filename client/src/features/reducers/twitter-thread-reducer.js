

export const twitter_initial_state = {
    enabled: false,
    stage: 0,
    focus_tweet: 0,
    tweets: [{ text: "" }],
    error: null
}

export default function TwitterThreadReducer(state, action) {
    switch (action.type) {
        case 'update_single':
            return { ...state, ...action.payload };
        case 'focus_tweet':
            return {
                ...state,
                focus_tweet: action.payload
            }
        case 'add_tweet':
            return {
                ...state,
                tweets: [...state.tweets, { text: "" }],
                focus_tweet: state.tweets.length
            }
        case 'update_tweet_text':
            return {
                ...state,
                tweets: [
                    ...state.tweets.slice(0, action.payload.index),
                    { ...state.tweets[action.payload.index], text: action.payload.value },
                    ...state.tweets.slice(action.payload.index + 1)
                ]
            }
        case 'update_tweet_media_preview':
            // set the preview blob for quick UI
            return {
                ...state,
                tweets: [
                    ...state.tweets.slice(0, action.payload.index),
                    { ...state.tweets[action.payload.index], media: { ...state.tweets[action.payload.index].media, preview: action.payload.value } },
                    ...state.tweets.slice(action.payload.index + 1)
                ]
            }

        case 'update_tweet_media_phase_2':
            // set the media ID and asset url from server response
            return {
                ...state,
                tweets: [
                    ...state.tweets.slice(0, action.payload.index),
                    { ...state.tweets[action.payload.index], media: { ...state.tweets[action.payload.index].media, ...action.payload.value } },
                    ...state.tweets.slice(action.payload.index + 1)
                ]
            }

        case 'delete_tweet_media':
            return {
                ...state,
                tweets: [
                    ...state.tweets.slice(0, action.payload),
                    { text: state.tweets[action.payload].text },
                    ...state.tweets.slice(action.payload + 1)
                ]
            }
        case 'delete_tweet':
            return {
                ...state,
                tweets: [
                    ...state.tweets.slice(0, action.payload),
                    ...state.tweets.slice(action.payload + 1)
                ],
                focus_tweet: action.payload - 1
            }
        case 'reset_state':
            return twitter_initial_state
        default:
            throw new Error();
    }
}

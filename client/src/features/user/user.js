import axios from 'axios'
import store from '../../app/store.js'

import {setDiscordId} from './user-reducer'


const registerUser = async (walletAddress) => {
    const result = await axios.get(`/user/fetch_discord_id/${walletAddress}`)
    if (result.data.discordId === 'null') {
        store.dispatch(setDiscordId(null))
    }
    else {
        
        store.dispatch(setDiscordId(result.data.discordId))
    }
}

export default registerUser;
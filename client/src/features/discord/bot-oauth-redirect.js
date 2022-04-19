import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../css/discord-oauth-redirect.css'




// on successful authorization, grab the ens and guild_id from url and send a post to the server

export default function SuccessfulDiscordRedirect() {
    const [isDataSent, setIsDataSent] = useState(false);
    const [didUserDenyBot, setDidUserDenyBot] = useState(false)
    const [didUserDenyIdentify, setDidUserDenyIdentify] = useState(false)
    const [oauthMode, setOauthMode] = useState('')


    useEffect(() => {
        (async () => {

            // fragment is for the bot addition
            const fragment = new URLSearchParams(window.location.hash.slice(1));
            //const [guild_id, state] = [fragment.get('guild_id'), fragment.get('state')];

            // straight search for user identify 
            const urlParams = new URLSearchParams(window.location.search);
            const guild_id = urlParams.get('guild_id')
            const state = urlParams.get('state')
            const code = urlParams.get('code')

            let userWallet = state.split(',')[0]
            let authType = state.split(',')[1]
            let ens = state.split(',')[2]


            if (authType === 'bot') {
               // const resp = await axios.post('/discord/addGuild', { wallet, guild_id });
               const resp = await axios.post('/discord/oauthFlow', { type: authType, code: code, ens: ens, wallet: userWallet, redirect_uri: window.location.origin + window.location.pathname });
                setOauthMode('bot')
            }
            else if (authType === 'user') {
                const resp = await axios.post('/discord/oauthFlow', { type: authType, code: code, wallet: userWallet, redirect_uri: window.location.origin + window.location.pathname });
                setOauthMode('user')

            }
            else {
                setDidUserDenyBot(true)
            }
        })();
    }, [])


    return (
        <>
            {oauthMode === 'bot' &&
                <>
                    {!didUserDenyBot &&
                        <div className="oauth-success-message">
                            <h1>🎉🎉🎉</h1>
                            <h1 style={{ color: 'white' }}>Woohoo! The bot was successfully added.</h1>
                            <h3>Please close this window.</h3>
                        </div>
                    }

                    {didUserDenyBot &&
                        <div className="oauth-success-message">
                            <h1 style={{ color: 'white' }}>You cancelled the bot request.</h1>
                            <h3>Please close this window.</h3>
                        </div>

                    }
                </>
            }
            {oauthMode === 'user' &&
                <>
                    {!didUserDenyIdentify &&
                        <div className="oauth-success-message">
                            <h1>🎉🎉🎉</h1>
                            <h1 style={{ color: 'white' }}>Woohoo! Your account was successfully linked.</h1>
                            <h3>Please close this window.</h3>
                        </div>
                    }

                    {didUserDenyIdentify &&
                        <div className="oauth-success-message">
                            <h1 style={{ color: 'white' }}>You cancelled the account request.</h1>
                            <h3>Please close this window.</h3>
                        </div>

                    }
                </>
            }
        </>
    )

}
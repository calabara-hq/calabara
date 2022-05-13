import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../css/discord-oauth-redirect.css'
import { useDispatch, useSelector } from 'react-redux';


// on successful authorization, grab the ens and guild_id from url and send a post to the server

export default function SuccessfulDiscordRedirect() {
    const [authError, setAuthError] = useState(false);
    const [didUserDenyBot, setDidUserDenyBot] = useState(false)
    const [didUserDenyIdentify, setDidUserDenyIdentify] = useState(false)
    const [oauthMode, setOauthMode] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {

            // fragment is for the bot addition
            const target = `${window.location.origin}`

            const urlParams = new URLSearchParams(window.location.search);
            const [guild_id, code, error, errorDescription] = [
                urlParams.get('guild_id'),
                urlParams.get('code'),
                urlParams.get('error'),
                urlParams.get('errorDescription'),

            ]

            console.log(guild_id)
            console.log(code)

            if (error) {
                window.opener.postMessage(
                    {
                        type: "DC_AUTH_ERROR",
                        data: { error, errorDescription }
                    },
                    target
                )
                return
            }

            // if we have guild_id, it's a bot. O/w it's regular user auth

            let authInfo;
            if (!guild_id) {
                authInfo = await axios.post('/discord/userOauthFlow', { code: code, redirect_uri: window.location.origin + window.location.pathname })
            }
            else if (guild_id) {
                authInfo = await axios.post('/discord/botOauthFlow', { code: code, redirect_uri: window.location.origin + window.location.pathname })
            }
            if (!authInfo) return setAuthError(true)
            console.log(authInfo)
            window.opener.postMessage(
                {
                    type: "DC_AUTH_SUCCESS",
                    data: authInfo.data,
                },
                target
            )


            //const [guild_id, state] = [fragment.get('guild_id'), fragment.get('state')];
            /*
                        // straight search for user identify 
                        const urlParams = new URLSearchParams(window.location.search);
                        const guild_id = urlParams.get('guild_id')
                        const state = JSON.parse(decodeURIComponent(urlParams.get('state')))
                        const code = urlParams.get('code')
            
            
                        let userWallet = state.walletAddress
                        let authType = state.integrationType
                        let ens = state.ens
            
                        const jwt = null;
                        if (authType === 'bot') {
                            const resp = await axios.post('/discord/botOauthFlow', { type: authType, code: code, ens: ens, wallet: userWallet, redirect_uri: window.location.origin + window.location.pathname }, dispatch, jwt);
                            // store the guild_id so we can use it back in the settings page'
                            console.log(resp)
                            if (!resp) return setAuthError(true)
                            setOauthMode('bot')
                        }
                        else if (authType === 'user') {
                            const resp = await axios.post('/discord/userOauthFlow', { type: authType, code: code, wallet: userWallet, redirect_uri: window.location.origin + window.location.pathname }, dispatch, jwt);
                            if (!resp) setAuthError(true)
                            setOauthMode('user')
            
                        }
                        else {
                            setDidUserDenyBot(true)
                            setDidUserDenyIdentify(true)
                        }
                    */
        })();
    }, [])


    return (
        <>
            {oauthMode === 'bot' &&
                <>
                    {(!didUserDenyBot && !authError) &&
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

                    {authError &&
                        <div className="oauth-success-message">
                            <h1 style={{ color: 'white' }}>Uh-oh, something went wrong.</h1>
                            <h3>Please close this window.</h3>
                        </div>
                    }
                </>
            }
            {oauthMode === 'user' &&
                <>
                    {(!didUserDenyIdentify && !authError) &&
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

                    {authError &&
                        <div className="oauth-success-message">
                            <h1 style={{ color: 'white' }}>Uh-oh, something went wrong.</h1>
                            <h3>Please close this window.</h3>
                        </div>
                    }
                </>
            }
        </>
    )

}
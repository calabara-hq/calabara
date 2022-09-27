import React, { useEffect, useState } from 'react'
import axios from 'axios'


// on successful authorization, grab the ens and guild_id from url and send a post to the server

export default function TwitterRedirect() {
    const [authError, setAuthError] = useState(false);
    const [didUserDenyBot, setDidUserDenyBot] = useState(false)
    const [didUserDenyIdentify, setDidUserDenyIdentify] = useState(false)
    const [oauthMode, setOauthMode] = useState('')

    const target = `${window.location.origin}`
    const urlParams = new URLSearchParams(window.location.search);
    const [guild_id, code, error, errorDescription] = [
        urlParams.get('guild_id'),
        urlParams.get('code'),
        urlParams.get('error'),
        urlParams.get('errorDescription'),
    ]

    const postMessages = () => {
        if (error) {
            try {
                window.postMessage(
                    {
                        type: "DC_AUTH_ERROR",
                        data: { error, errorDescription }
                    },
                    target
                )
            } catch(err){
                console.log(err)
            }
        }
    }




    useEffect(() => {

        /*
        const timer = setInterval(() => {
            postMessages();
        }, 1000)

        return () => clearInterval(timer)
        */
    }, [])



    /*

useEffect(() => {
    // fragment is for the bot addition
    const target = `${window.location.origin}`
    console.log(target)
    const urlParams = new URLSearchParams(window.location.search);
    const [guild_id, code, error, errorDescription] = [
        urlParams.get('guild_id'),
        urlParams.get('code'),
        urlParams.get('error'),
        urlParams.get('errorDescription'),
    ]

    console.log(error)

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
    /*
    let authInfo;
    if (!guild_id) {
        authInfo = await axios.post('/discord/userOauthFlow', { code: code, redirect_uri: window.location.origin + window.location.pathname })
    }
    else if (guild_id) {
        authInfo = await axios.post('/discord/botOauthFlow', { code: code, redirect_uri: window.location.origin + window.location.pathname })
    }
    if (!authInfo) return setAuthError(true)

    window.opener.postMessage(
        {
            type: "DC_AUTH_SUCCESS",
            data: authInfo.data,
        },
        target
    )
}, [window])
    */


    return (
            <p>HELLO</p>
    )

}
import { useEffect, useState } from "react";
import usePopupWindow from "./usePopupWindow";

const DISCORD_CLIENT_KEY = process.env.REACT_APP_DISCORD_CLIENT_KEY;

export const useDiscordAuth = (scope, authState, setAuthState, guild_id) => {
    let urlScope, redirectUrl;
    if (scope === 'identify') urlScope = 'identify'
    else if (scope === 'bot') urlScope = `bot%20applications.commands&guild_id=${guild_id}`

    if(process.env.NODE_ENV === 'production') redirectUrl = encodeURIComponent('https://calabara.com/oauth/discord')
    else if(process.env.NODE_ENV === 'development') redirectUrl = encodeURIComponent('https://localhost:3000/oauth/discord')
    
    const { onOpen, windowInstance } = usePopupWindow(`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_KEY}&redirect_uri=${redirectUrl}&response_type=code&scope=${urlScope}`)

    const [error, setError] = useState(null)

    useEffect(() => {
        if (!authState) return

        const timeout = setTimeout(() => {
            setAuthState(null)
        }, 540_000)

        return () => clearTimeout(timeout)

    }, [authState])

    /** On a window creation, we set a new listener */
    useEffect(() => {
        
        if (!windowInstance) return

        const popupMessageListener = async (event) => {
            /**
             * Conditions are for security and to make sure, the expected messages are
             * being handled (extensions are also communicating with message events)
             */
            if (
                event.isTrusted &&
                event.origin === window.location.origin &&
                typeof event.data === "object" &&
                "type" in event.data &&
                "data" in event.data
            ) {
                const { data, type } = event.data

                
                switch (type) {
                    case "DC_AUTH_SUCCESS":
                        setAuthState({
                            ...data,
                            authorization: `${data.token_type} ${data.access_token}`,
                        })
                        break
                    case "DC_AUTH_ERROR":
                        setError(data)
                        break
                    default:
                        // Should never happen, since we are only processing events that are originating from us
                        setError({
                            error: "Invalid message",
                            errorDescription:
                                "Recieved invalid message from authentication window",
                        })
                }

                //windowInstance?.close()
            }
        }

        window.addEventListener("message", popupMessageListener)
        return () => window.removeEventListener("message", popupMessageListener)
    }, [windowInstance])

    return {
        authorization: authState,
        error,
        onOpen: () => {
            setError(null)
            onOpen()
        },
        isAuthenticating: !!windowInstance && !windowInstance.closed,
    }

}

export default useDiscordAuth

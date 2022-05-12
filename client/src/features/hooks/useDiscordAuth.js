import { useEffect, useState } from "react";
import usePopupWindow from "./usePopupWindow";
import useLocalStorage from "./useLocalStorage";

const DISCORD_CLIENT_KEY = process.env.REACT_APP_DISCORD_CLIENT_KEY;
console.log(DISCORD_CLIENT_KEY)

export const useDiscordAuth = (scope) => {
    let urlScope;
    if(scope === 'identify') urlScope = 'identify'
    else if(scope === 'bot') urlScope = 'bot%20applications.commands'
    const { onOpen, windowInstance } = usePopupWindow(`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_KEY}&redirect_uri=https%3A%2F%2F${window.location.hostname + ':' + window.location.port}%2Foauth%2Fdiscord&response_type=code&scope=${urlScope}`)

    const [error, setError] = useState(null)
    const [auth, setAuth] = useLocalStorage(`dc_auth_${scope}`, {})

    useEffect(() => {
        if (!auth.expires) return
        if (Date.now() > auth.expires) {
            setAuth({})
        } else {
            const timeout = setTimeout(() => {
                setAuth({})
                // Extra 60_000 is just for safety, since timeout is known to be somewhat unreliable
            }, auth.expires - Date.now() - 60_000)

            return () => clearTimeout(timeout)
        }
    }, [auth])

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
                        setAuth({
                            ...data,
                            authorization: `${data.tokenType} ${data.accessToken}`,
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

                windowInstance?.close()
            }
        }

        window.addEventListener("message", popupMessageListener)
        return () => window.removeEventListener("message", popupMessageListener)
    }, [windowInstance])

    return {
        authorization: auth,
        error,
        onOpen: () => {
            setError(null)
            onOpen()
        },
        isAuthenticating: !!windowInstance && !windowInstance.closed,
    }

}

export default useDiscordAuth

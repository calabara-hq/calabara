import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsConnected, selectWalletAddress } from "../../app/sessionReducer";
import { setUserTwitter } from "../user/user-reducer";
import { socket } from "../../service/socket";


export const useTwitterAuth = (authenticationType) => {
    const [authState, setAuthState] = useState(0);
    const [accountInfo, setAccountInfo] = useState(null);
    const [error, setError] = useState(false);
    const [authType, setAuthType] = useState(authenticationType);
    const isConnected = useSelector(selectIsConnected)
    const [authURI, setAuthURI] = useState(null);
    const dispatch = useDispatch();


    // get authentication link
    // open link
    // if success, set auth state and proceed
    // if error, re-fetch auth link with access level, force user to click again, and start over 


    // regenerate auth link on wallet connect
    useEffect(() => {
        if (isConnected && authType) generateAuthLink(authType)
    }, [isConnected])

    useEffect(() => {
        if (authType) {
            generateAuthLink(authType)
        }
    }, [authType])


    // resest auth after 20 seconds
    useEffect(() => {
        if (authState === 1) {
            const timer = setTimeout(() => {
                if (authState === 1) {
                    handleAuthError()
                }
            }, 20_000)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [authState])


    useEffect(() => {
        const authHandler = (response) => {
            if (response.status === 'success') {
                setAccountInfo(response.data)
                dispatch(setUserTwitter(response.data))
                setError(false)
                setAuthState(2)
            }
            else if (response.status === 'failed') {
                handleAuthError()
            }
        }
        socket.on('user_twitter_auth', authHandler)
    }, [socket])


    const generateAuthLink = (scope_type) => {
        axios.post('/twitter/generateAuthLink', { scope_type: scope_type }, { withCredentials: true })
            .then(res => {
                setAuthURI(res.data)
            })
    }

    // on initial open, we check if user is already authed
    const handleOpenAuth = () => {
        if (error) setError(false)
        if (!authURI) return
        window.open(authURI, "_blank", "height=750,width=600,scrollbars")
        setAuthState(1);
    }

    const handleAuthError = () => {
        setError(true);
        setAccountInfo(null);
        setAuthState(0);
    }


    const destroySession = () => {
        fetch('/twitter/destroy_session')
            .then(() => {
                setError(false);
                setAccountInfo(null);
                setAuthState(0);
                generateAuthLink(authType)
            })
    }


    return {
        authState: authState,
        accountInfo,
        setTwitterAuthType: (authenticationType) => setAuthType(authenticationType),
        onOpen: () => handleOpenAuth(),
        destroySession: () => destroySession(),
        auth_error: error,

    }

}
export default useTwitterAuth

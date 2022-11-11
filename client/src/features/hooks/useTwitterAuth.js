import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserTwitter } from "../user/user-reducer";

export const useTwitterAuth = () => {
    const [authState, setAuthState] = useState(0);
    const [accountInfo, setAccountInfo] = useState(null);
    const [error, setError] = useState(false);
    const dispatch = useDispatch();
    const openWindow = (uri) => {
        return window.open(uri, "_blank", "height=750,width=600,scrollbars")
    }

    // on initial open, we check if user is already authed
    const handleOpenAuth = (scope_type) => {
        if (error) setError(false)
        axios.post('/twitter/generateAuthLink', { scope_type: scope_type }, { withCredentials: true })
            .then(res => {
                openWindow(res.data)
                setAuthState(1);
                setTimeout(pollAuthState, 3000)
            })
    }

    const pollAuthState = () => {
        console.log('polling')
        return fetch('/twitter/poll_auth_status', { credentials: 'include' })
            .then(data => data.json())
            .then(data => {
                switch (data.status) {
                    case 'error':
                        console.log('something went horribly wrong')
                        handleAuthError()
                        break
                    case 'pending':
                        console.log('pending')
                        console.log(error)
                        setTimeout(pollAuthState, 2000)
                        break
                    case 'ready':
                        console.log('ready')
                        setAccountInfo(data.user)
                        dispatch(setUserTwitter(data.user))
                        setError(false)
                        setAuthState(2)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleAuthError = () => {
        fetch('/twitter/destroy_session')
            .then(() => {
                setError(true);
                setAccountInfo(null);
                setAuthState(0)
            })
    }

    const destroySession = () => {
        fetch('/twitter/destroy_session')
            .then(() => {
                console.log('resetting state')
                setError(false);
                setAccountInfo(null);
                setAuthState(0)
            })
    }


    return {
        authState: authState,
        accountInfo,
        onOpen: (scope_type) => {
            handleOpenAuth(scope_type)
        },
        destroySession: () => destroySession(),
        auth_error: error,

    }

}
export default useTwitterAuth

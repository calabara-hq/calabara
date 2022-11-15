import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectWalletAddress } from "../../app/sessionReducer";
import { setUserTwitter } from "../user/user-reducer";

export const useTwitterAuth = (authType) => {
    const [authState, setAuthState] = useState(0);
    const [accountInfo, setAccountInfo] = useState(null);
    const [error, setError] = useState(false);
    const [authenticationType, setAuthenticationType] = useState(authType);
    const walletAddress = useSelector(selectWalletAddress)
    const [authURI, setAuthURI] = useState(null);
    const dispatch = useDispatch();

    
    useEffect(() => {
        if (authenticationType) {
            generateAuthLink(authenticationType)
        }
    }, [authenticationType, walletAddress])

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
        setTimeout(pollAuthState, 3000)
    }

    const pollAuthState = () => {
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
        authenticationType,
        setAuthenticationType,
        onOpen: () => handleOpenAuth(),
        destroySession: () => destroySession(),
        auth_error: error,

    }

}
export default useTwitterAuth

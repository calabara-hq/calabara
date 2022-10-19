import axios from "axios";
import { useEffect, useState } from "react";
import usePopupWindow from "./usePopupWindow";

export const useTwitterAuth = () => {
    const [authState, setAuthState] = useState(0);
    const [accountInfo, setAccountInfo] = useState(null);
    const [error, setError] = useState(false);

    const openWindow = (uri) => {
        return window.open(uri, "_blank", "height=750,width=600,scrollbars")
    }


    // on initial open, we check if user is already authed
    const handleOpenAuth = () => {
        axios.post('/twitter/generateAuthLink', { withCredentials: true })
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
                        setError(true)
                        break
                    case 'pending':
                        console.log('pending')
                        if (!error) setTimeout(pollAuthState, 2000)
                        break
                    case 'ready':
                        console.log('ready')
                        setAccountInfo(data.user)
                        setAuthState(2)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    return {
        authState: authState,
        accountInfo,
        onOpen: () => {
            handleOpenAuth()
        },
        auth_error: error
    }

}
export default useTwitterAuth

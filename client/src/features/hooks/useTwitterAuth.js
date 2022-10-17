import { useEffect, useState } from "react";
import usePopupWindow from "./usePopupWindow";
import { socket } from "../../service/socket";
const DISCORD_CLIENT_KEY = process.env.REACT_APP_DISCORD_CLIENT_KEY;

export const useTwitterAuth = () => {
    const [authLink, setAuthLink] = useState(false);
    const [authState, setAuthState] = useState(0);
    const [accountInfo, setAccountInfo] = useState(null);
    const { onOpen, windowInstance } = usePopupWindow(authLink);



    const getAuthState = () => {
        return fetch('/twitter/poll_auth_status')
            .then(data => data.json())
            .then(data => {
                if (data.authorized) {
                    setAccountInfo(data);
                    setAuthState(2);
                    return true
                }
                else {
                    return false
                }
            })
    }

    useEffect(() => {
        console.log('socket update!!!')

        const authListener = (user) => {
            console.log(user)
        }

        socket.on('twitter_authorization', authListener)
    }, [socket])


    const pollAuthState = () => {
        console.log('polling')
        getAuthState()
            .then(data => {
                console.log(data)
                if (!data) {
                    setAuthState(1);
                    setTimeout(pollAuthState, 1000)
                }
            })
    }

    const handleOpenAuth = () => {
        getAuthState()
            .then(data => {
                if (!data) {
                    onOpen();
                    setAuthState(1);
                    setTimeout(pollAuthState, 2000);
                }
            })
    }


    const getAuthLink = () => {
        fetch('/twitter/generateAuthLink')
            .then(data => data.text())
            .then(data => setAuthLink(data))
    }

    return {
        authLink,
        authState: authState,
        accountInfo,
        getAuthLink,
        onOpen: () => {
            handleOpenAuth()
        },
    }

}
export default useTwitterAuth

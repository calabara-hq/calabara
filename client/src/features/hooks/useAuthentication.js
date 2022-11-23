import { useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { useEffect } from "react";
import { useAccount, useDisconnect } from 'wagmi';
import { showNotification } from "../notifications/notifications";

import { useDispatch, useSelector } from "react-redux";
import { selectUserSession, selectWalletAddress } from "../../app/sessionReducer";
import { socket } from "../../service/socket";
import { destroyTwitter, setUserTwitter } from "../user/user-reducer";


export default function useAuthentication() {
    const { openConnectModal } = useConnectModal()
    const connectedAddress = useSelector(selectWalletAddress)
    const session = useSelector(selectUserSession)
    const { disconnect } = useDisconnect({
        onSuccess() {
            dispatch(destroyTwitter())
        }
    });

    const { address } = useAccount();
    const dispatch = useDispatch()


    useEffect(() => {
        if (connectedAddress && (connectedAddress !== address)) {
            disconnect();
        }
    }, [address])


    useEffect(() => {
        if (!session) return disconnect()
        handleActiveSession()
    }, [session])


    const handleActiveSession = () => {
        fetchUserTwitter();
        socket.emit('user-subscribe', connectedAddress)
    }


    const fetchUserTwitter = async () => {
        let twitter_data = await axios.get('/twitter/user_account')
            .then(res => res.data)
            .then(res => res ? res.twitter : null)
        if (twitter_data) dispatch(setUserTwitter(twitter_data))
    }


    const authenticated_post = async (endpoint, body) => {
        // just stop them here if they aren't authenticated
        if (!session) {
            showNotification('hint', 'hint', 'please connect your wallet')
            openConnectModal()
            return null
        }

        return axios.post(endpoint, body, { withCredentials: true })
            .then(res => { return res })
            .catch(err => {
                switch (err.response.status) {
                    case 401:
                        showNotification('hint', 'hint', 'please connect your wallet')
                        if (!session) openConnectModal()
                        break;
                    case 403:
                        showNotification('error', 'error', 'this wallet is not an organization admin')
                        break;
                    case 419:
                        showNotification('error', 'error', 'this wallet does not meet submission requirements')
                    case 420:
                        showNotification('error', 'error', 'you have already made a submission for this contest')
                        break;
                    case 432:
                        showNotification('error', 'error', 'this contest is not accepting submissions at this time')
                        break;
                    case 433:
                        showNotification('error', 'error', 'this contest is not accepting votes at this time')
                        break;
                    case 434:
                        showNotification('error', 'error', 'this wallet does not meet voting requirements')
                        break;
                    case 435:
                        showNotification('error', 'error', 'you cannot vote on your own submission')
                        break
                    case 436:
                        showNotification('error', 'error', 'amount exceeds available voting power')
                        break
                    case 437:
                        showNotification('error', 'error', 'only select addresses are able to create contests at this time')
                        break
                    case 438:
                        showNotification('error', 'error', 'the contest is not over yet!')
                        break
                    case 439:
                        showNotification('error', 'error', 'not a twitter contest')
                        break
                    case 440:
                        showNotification('error', 'error', 'twitter account not authorized')
                        break
                    case 441:
                        showNotification('error', 'error', 'this tweet looks too similar to one you\'ve posted before. Please change it and try again')
                        break
                    case 442:
                        showNotification('error', 'error', 'problem sending the tweet')
                        break
                    case 443:
                        showNotification('error', 'error', 'malformed tweet')
                        break
                    case 444:
                        showNotification('error', 'error', 'twitter is down. please try again later')
                        break
                }
                return null
            })

    }



    return {
        disconnect: () => { disconnect() },
        authenticated_post: async (endpoint, body) => { return await authenticated_post(endpoint, body) }
    }
}
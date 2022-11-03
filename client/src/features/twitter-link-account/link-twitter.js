import { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsConnected } from "../../app/sessionReducer";
import Placeholder from "../creator-contests/components/common/spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { LinkTwitterButton, RetryWrap } from "./styles";

export default function LinkTwitter(props) {
    const isWalletConnected = useSelector(selectIsConnected);
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        props.setTwitterData({ type: 'update_single', payload: { error: null } })
        setLoading(true);
        console.log(props.auth_type)
        props.onOpen(props.auth_type)
    }


    if (!loading && !props.auth_error) { return <LinkTwitterButton disabled={!isWalletConnected} onClick={handleClick}><p style={{ marginBottom: '0px' }}><FontAwesomeIcon icon={faTwitter} /> Link Account</p></LinkTwitterButton> }
    else if (loading && !props.auth_error) return <div><Placeholder /></div>
    else if (props.auth_error) return (
        <RetryWrap>
            <div><p style={{ fontSize: '16px' }}>Twitter authentication failed. Please try again</p></div>
            <LinkTwitterButton onClick={handleClick}><p style={{ marginBottom: '0px', margin: '0 auto' }}><FontAwesomeIcon icon={faTwitter} /> Retry</p></LinkTwitterButton>
        </RetryWrap>
    )
}
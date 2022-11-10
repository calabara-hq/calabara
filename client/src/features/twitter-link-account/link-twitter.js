import { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsConnected } from "../../app/sessionReducer";
import Placeholder from "../creator-contests/components/common/spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { LinkTwitterButton, MinimalLinkTwitterButton, RetryWrap } from "./styles";

export default function LinkTwitter(props) {
    const isWalletConnected = useSelector(selectIsConnected);
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        props.clearErrors()
        setLoading(true);
        props.onOpen(props.auth_type)
    }

    if (props.minimal) return <MinimalDisplay isWalletConnected={isWalletConnected} loading={loading} handleClick={handleClick} auth_error={props.auth_error} />
    return <StandardDisplay isWalletConnected={isWalletConnected} loading={loading} handleClick={handleClick} auth_error={props.auth_error} />
}

// minimal --> small button with no dialogue

function MinimalDisplay(props) {
    if (!props.loading && !props.auth_error) { return <MinimalLinkTwitterButton onClick={props.handleClick}><p style={{ margin: '0px' }}><FontAwesomeIcon icon={faTwitter} /> connect</p></MinimalLinkTwitterButton> }
    else if (props.loading && !props.auth_error) return <div style={{ width: '100px', position: 'relative' }}><Placeholder /></div>
    else if (props.auth_error) return (
        <MinimalLinkTwitterButton onClick={props.handleClick}><p style={{ marginBottom: '0px', margin: '0px' }}><FontAwesomeIcon icon={faTwitter} /> retry</p></MinimalLinkTwitterButton>
    )
}

function StandardDisplay(props) {
    if (!props.loading && !props.auth_error) { return <LinkTwitterButton disabled={!props.isWalletConnected} onClick={props.handleClick}><p style={{ marginBottom: '0px' }}><FontAwesomeIcon icon={faTwitter} /> Link Account</p></LinkTwitterButton> }
    else if (props.loading && !props.auth_error) return <div><Placeholder /></div>
    else if (props.auth_error) return (
        <RetryWrap>
            <div><p style={{ fontSize: '16px' }}>Twitter authentication failed. Please try again</p></div>
            <LinkTwitterButton onClick={props.handleClick}><p style={{ marginBottom: '0px', margin: '0 auto' }}><FontAwesomeIcon icon={faTwitter} /> Retry</p></LinkTwitterButton>
        </RetryWrap>
    )
}
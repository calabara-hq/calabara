import { useEffect, useReducer, useState, useRef } from "react"
import styled from 'styled-components'
import useTwitterAuth from "../../../../hooks/useTwitterAuth";
import { ToggleButton } from "../../common/common_components";
import { Contest_h3_alt } from "../../common/common_styles";
import { useWalletContext } from "../../../../../app/WalletContext";
import { useSelector } from "react-redux";
import { selectIsConnected } from "../../../../../app/sessionReducer";
import CreateThread from "../../../../create-twitter-thread/create-thread";
import LinkTwitter from "../../../../twitter-link-account/link-twitter";
import {
    TwitterWrap,
    ParamsWrap,
    Parameter,
    LinkTwitterWrap,
    ConnectWalletButton
} from './styles'



export default function Twitter(props) {
    const { authState, auth_error, accountInfo, generateAuthLink, onOpen, destroySession } = useTwitterAuth('privileged')

    const destroy_session = () => {
        destroySession()
        props.setTwitterData({ type: 'reset_state' })
    }


    const toggleTwitter = () => {
        if (!props.twitterData.enabled) {
            props.setTwitterData({ type: 'update_single', payload: { stage: 1 } })
        }
        else {
            destroy_session()
            props.setTwitterData({ type: 'update_single', payload: { stage: 0 } })
        }
        props.setTwitterData({ type: 'update_single', payload: { enabled: !props.twitterData.enabled } })
    }



    return (
        <TwitterWrap title={"Twitter Integration"}>
            <ParamsWrap>
                <Parameter>
                    <Contest_h3_alt>Integrate Twitter</Contest_h3_alt>
                    <ToggleButton identifier={'twitter-toggle'} isToggleOn={props.twitterData.enabled} handleToggle={toggleTwitter} />
                    <p style={{ color: '#a3a3a3' }}>Collect submissions via twitter interactions </p>
                    <b></b>
                </Parameter>
                <ActionController authState={authState} onOpen={onOpen} accountInfo={accountInfo} twitterData={props.twitterData} setTwitterData={props.setTwitterData} auth_error={auth_error} />
            </ParamsWrap>
        </TwitterWrap>
    )
}


function ActionController(props) {
    const { walletConnect } = useWalletContext();
    const isWalletConnected = useSelector(selectIsConnected);
    useEffect(() => {
        if (props.authState === 2) {
            props.setTwitterData({ type: 'update_single', payload: { stage: 2 } })
        }
    }, [props.authState])


    if (props.twitterData.stage === 1) {
        return (
            <>
                {props.twitterData.error === "invalid_auth" && <div className="tab-message error"><p>please authenticate your twitter account</p></div>}
                <LinkTwitterWrap>
                    {!isWalletConnected ? <ConnectWalletButton onClick={walletConnect}>Connect</ConnectWalletButton> : null}
                    <LinkTwitter onOpen={props.onOpen} accountInfo={props.accountInfo} clearErrors={() => props.setTwitterData({ type: 'update_single', payload: { error: null } })} auth_error={props.auth_error} auth_type={'privileged'} />
                </LinkTwitterWrap>
            </>
        )
    }

    else if (props.twitterData.stage === 2) {
        return (
            <>
                <div>
                    <Contest_h3_alt>Announcement Tweet</Contest_h3_alt>
                    <b></b>
                    <p style={{ color: '#a3a3a3' }}>We'll tweet this for you once you're done </p>
                    {props.twitterData.error === "empty_content" && <div className="tab-message error"><p>announcement tweet can't be empty</p></div>}
                    <b style={{ marginBottom: '30px' }}></b>
                </div>
                <CreateThread accountInfo={props.accountInfo} authState={props.authState} twitterData={props.twitterData} setTwitterData={props.setTwitterData} showTweetButton={false} />
            </>
        )
    }
}




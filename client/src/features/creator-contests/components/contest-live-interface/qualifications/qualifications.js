import { useState, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsConnected, selectWalletAddress } from "../../../../../app/sessionReducer";
import { useWalletContext } from "../../../../../app/WalletContext";
import useSubmissionEngine from "../../../../hooks/useSubmissionEngine";
import { Contest_h4 } from "../../common/common_styles";
import { selectContestSettings, selectContestState } from "../interface/contest-interface-reducer";
import { ExpandedPromptComponent } from "../prompts/prompt-display";
import { DataGrid, GridElement, DataWrap, QualificationsContainer, RestrictionStatus, RestrictionStatusNotConnected, ConnectWalletButton, AltSubmissionButton, SubmissionStatus, AccountLink, TwitterWrap, SmallLinkTwitterButton } from "./styles";
import { TagType, TokenType } from "../../../../../css/token-button-styles";
import useContestVotes from "../../../../hooks/useContestVotes";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SummaryWrap } from "../../contest-details/detail-style";
import ContestSummaryComponent from "../../contest-details/detail-components";
import DrawerComponent from "../../../../drawer/drawer";
import { selectIsTwitterLinked, selectUserTwitter, setUserTwitter } from "../../../../user/user-reducer";
import useTwitterAuth from "../../../../hooks/useTwitterAuth";
import LinkTwitter from "../../../../twitter-link-account/link-twitter";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import Placeholder from "../../common/spinner";
let compact_formatter = Intl.NumberFormat('en', { notation: 'compact' })

export default function Qualifications() {
    return (
        <QualificationsContainer>
            <Data />
        </QualificationsContainer>
    )
}


function Data() {
    //const contest_state = useSelector(selectContestState)
    const contest_state = 1;
    const isWalletConnected = useSelector(selectWalletAddress)
    if (contest_state === 0) {
        return <SubmissionRequirements />
    }
    else if (contest_state === 1) {
        if (isWalletConnected) return <VotingData />
        else return <VotingRequirements />
    }
    else if (contest_state === 2) {
        return <Winners />
    }
}


function SubmissionRequirements() {
    const contest_settings = useSelector(selectContestSettings)
    const { walletConnect } = useWalletContext();
    const { isWalletConnected, alreadySubmittedError, restrictionResults, isUserEligible, submissionStatus } = useSubmissionEngine(contest_settings.submitter_restrictions);
    const [isCreating, setIsCreating] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = 'hidden';
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setIsCreating(false);
        document.body.style.overflow = 'unset';
    }

    // if wallet is connected, subscribe to a submission status webhook
    // if user twitter id + hash matches an unregistered tweet in the tweets db, set the submission status to pending

    // status: 
    // wallet connected + hasnt submitted = hasnt submitted
    // wallet not connected  = connect wallet
    // wallet connected + submitted = submitted
    // wallet connected + pending = registering

    // connect wallet
    // !connected

    // hasnt submitted
    // wallet connected + alreadySubmitted

    // registering
    // wallet connected + status = pending

    // submitted
    // wallet connected + 

    return (
        <DataWrap>
            {/*<Contest_h4>Eligibility</Contest_h4>*/}
            <GridElement>
                <div style={{ color: '#b3b3b3' }}><Contest_h4>Eligibility</Contest_h4></div>
                <div>{isWalletConnected ? <p></p> : <ConnectWalletButton onClick={walletConnect}>Connect</ConnectWalletButton>}</div>
            </GridElement>
            <DataGrid>
                {isWalletConnected &&
                    <>
                        {Object.values(restrictionResults).map((restriction, index) => {
                            if (restriction.type === 'erc20' || restriction.type === 'erc721' || restriction.type === 'erc1155') {
                                return (
                                    <GridElement key={index}>
                                        <div><p>{restriction.threshold} {restriction.symbol}</p></div>
                                        <div>
                                            <p>
                                                {isWalletConnected && <RestrictionStatus index={index + 1} isConnected={isWalletConnected} status={restriction.user_result} key={`${isWalletConnected}-${restriction.user_result}`} />}
                                                {!isWalletConnected && <RestrictionStatusNotConnected />}
                                            </p>
                                        </div>
                                    </GridElement>
                                )
                            }
                        })}
                        <TwitterStatus />
                        <GridElement>
                            <div><p>Status</p></div>
                            <ComputeStatus submissionStatus={submissionStatus} isUserEligible={isUserEligible} />
                        </GridElement>
                        <GridElement>
                            <div>
                                <p></p>
                            </div>
                            <div>
                                {submissionStatus === 'not submitted' && <AltSubmissionButton disabled={!isUserEligible} onClick={handleDrawerOpen}>Submit</AltSubmissionButton>}
                            </div>
                            <>
                                <ExpandedPromptComponent isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose} isCreating={isCreating} setIsCreating={setIsCreating} />
                            </>
                        </GridElement>
                    </>
                }
            </DataGrid>
        </DataWrap>
    )
}

function TwitterStatus({ }) {
    const isTwitterLinked = useSelector(selectIsTwitterLinked)
    const twitterAccount = useSelector(selectUserTwitter)

    if (isTwitterLinked) {
        return (
            <GridElement>
                <div><p>Twitter</p></div>
                <div><p><img style={{ borderRadius: '100px', maxWidth: '30px' }} src={twitterAccount.profile_image_url} /><SubmissionStatus status={'pass'} key={`twitter-eligibility`} /></p></div>
            </GridElement>
        )
    }

    return (
        <LinkTwitterAccount />
    )
}


function LinkTwitterAccount({ }) {
    const { onOpen, auth_error, accountInfo } = useTwitterAuth();
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    useEffect(() => {
        if (accountInfo) {
            console.log(accountInfo)
            dispatch(setUserTwitter(accountInfo))
        }
    }, [accountInfo])

    return (
        <GridElement>
            <div><p>Twitter</p></div>
            {/*<div><p><button>hi</button><SubmissionStatus status={'fail'} key={`twitter-eligibility`} /></p></div>*/}
            <div>
                <TwitterWrap>
                    <LinkFunctionality setError={setError} auth_type={'standard'} auth_error={auth_error} onOpen={onOpen} customButton={true} />
                    <SubmissionStatus status={'fail'} key={`twitter-eligibility`} />
                </TwitterWrap>
            </div>
        </GridElement>
    )
}

function LinkFunctionality(props) {
    const [loading, setLoading] = useState(false)
    const handleClick = () => {
        props.setError(null);
        setLoading(true);
        props.onOpen(props.auth_type)
    }
    if (!loading && !props.auth_error) { return <SmallLinkTwitterButton onClick={handleClick}><p style={{ margin: '0px' }}><FontAwesomeIcon icon={faTwitter} /> connect</p></SmallLinkTwitterButton> }
    else if (loading && !props.auth_error) return <div style={{width: '100px', position: 'relative'}}><Placeholder /></div>
    else if (props.auth_error) return (
        <SmallLinkTwitterButton onClick={handleClick}><p style={{ marginBottom: '0px', margin: '0px' }}><FontAwesomeIcon icon={faTwitter} /> retry</p></SmallLinkTwitterButton>
    )
}


function ComputeStatus({ submissionStatus, isUserEligible }) {

    if (submissionStatus === 'not submitted') {
        if (isUserEligible) return <div><p>eligible<SubmissionStatus status={'pass'} key={`${submissionStatus}-eligibility`} /></p></div>
        else return <div><p>not eligible<SubmissionStatus status={'fail'} key={`${submissionStatus}-eligibility`} /></p></div>
    }

    else if (submissionStatus === 'submitted') {
        return <div><p>submitted<SubmissionStatus status={'pass'} key={`${submissionStatus}-eligibility`} /></p></div>
    }
    else if (submissionStatus === 'registering') {
        return <div><p>registering submission<SubmissionStatus status={'loading'} key={`${submissionStatus}-eligibility`} /></p></div>
    }
}

function VotingRequirements() {
    const contest_settings = useSelector(selectContestSettings)
    const isWalletConnected = useSelector(selectIsConnected)
    const { walletConnect } = useWalletContext();

    return (
        <DataWrap>
            <Contest_h4>Voting Eligibility</Contest_h4>
            <DataGrid>
                {contest_settings.voter_restrictions.length > 1 && <p style={{ color: '#a3a3a3' }}>must satisfy at least one of:</p>}
                {contest_settings.voter_restrictions.map((restriction, idx) => {
                    return (
                        <GridElement key={idx}>
                            <div><p>{restriction.threshold} {restriction.symbol}</p></div>
                            <div><TokenType><TagType type={restriction.type}>{restriction.type}</TagType></TokenType></div>
                        </GridElement>
                    )
                })}
                <GridElement>
                    <div><p></p></div>
                    <div>{!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>Connect</ConnectWalletButton>}</div>
                </GridElement>
            </DataGrid>
        </DataWrap>
    )
}



function VotingData() {
    const contest_settings = useSelector(selectContestSettings)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {
        remaining_vp,
        total_available_vp,
    } = useContestVotes(); // use 0 since we're not intersted in any specific sub

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        document.body.style.overflow = 'unset';
    }


    useEffect(() => {
        console.log(total_available_vp)
    }, [total_available_vp])


    return (
        <DataWrap>
            <Contest_h4>Votes</Contest_h4>
            <DataGrid>
                <GridElement>
                    <div><p>Total voting power</p></div>
                    <div><p>{compact_formatter.format(total_available_vp)}</p></div>
                </GridElement>
                <GridElement>
                    <div><p>Votes spent</p></div>
                    <div><p>{compact_formatter.format(total_available_vp - remaining_vp)}</p></div>
                </GridElement>
                <GridElement>
                    <div><p>Remaining voting power</p></div>
                    <div><p>{compact_formatter.format(remaining_vp)}</p></div>
                </GridElement>
            </DataGrid>
            <span onClick={handleDrawerOpen}><FontAwesomeIcon icon={faQuestionCircle} /></span>
            <DrawerComponent drawerOpen={drawerOpen} handleClose={handleDrawerClose} showExit={true}>
                <SummaryWrap>
                    <ContestSummaryComponent contest_settings={contest_settings} />
                </SummaryWrap>
            </DrawerComponent>
        </DataWrap>
    )
}


function Winners() {
    return (
        <DataWrap>

        </DataWrap>
    )
}
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWalletContext } from "../../../../../app/WalletContext";
import useSubmissionEngine from "../../../../hooks/useSubmissionEngine";
import useTwitterAuth from "../../../../hooks/useTwitterAuth";
import LinkTwitter from "../../../../twitter-link-account/link-twitter";
import { selectIsTwitterLinked, selectUserTwitter, setUserTwitter } from "../../../../user/user-reducer";
import { Contest_h4 } from "../../common/common_styles";
import { selectContestSettings } from "../interface/contest-interface-reducer";
import { AltSubmissionButton, ConnectWalletButton, DataGrid, DataWrap, GridElement, RestrictionStatus, RestrictionStatusNotConnected, SubmissionStatus, TwitterAccountBox, TwitterSwitchAccount, TwitterWrap } from "./styles";

export default function SubmissionQualifications({ showTwitter, submitOnClick }) {
    const contest_settings = useSelector(selectContestSettings)
    const { walletConnect } = useWalletContext();
    const { isWalletConnected, alreadySubmittedError, restrictionResults, isUserEligible, submissionStatus, processEligibility } = useSubmissionEngine(contest_settings.submitter_restrictions);


    return (
        <DataWrap>
            <GridElement>
                <div style={{ color: '#b3b3b3' }}><Contest_h4>My Eligibility</Contest_h4></div>
                <div>{isWalletConnected ? <p></p> : <ConnectWalletButton onClick={walletConnect}>Connect</ConnectWalletButton>}</div>
            </GridElement>
            {isWalletConnected &&
                <DataGrid>
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
                    {(contest_settings.twitter_integration && showTwitter) ? <TwitterStatus processEligibility={processEligibility} /> : null}
                    <GridElement>
                        <div><p>Status</p></div>
                        <ComputeStatus submissionStatus={submissionStatus} isUserEligible={isUserEligible} />
                    </GridElement>
                    <GridElement>
                        <div>
                            <p></p>
                        </div>
                        <div>
                            {submissionStatus === 'not submitted' && <AltSubmissionButton disabled={!isUserEligible} onClick={submitOnClick}>Submit</AltSubmissionButton>}
                        </div>
                    </GridElement>
                </DataGrid>
            }
        </DataWrap>
    )
}

function TwitterStatus({ processEligibility }) {
    const isTwitterLinked = useSelector(selectIsTwitterLinked)
    const twitterAccount = useSelector(selectUserTwitter)
    const { onOpen, auth_error, accountInfo } = useTwitterAuth();
    const [error, setError] = useState(null)
    const dispatch = useDispatch();

    // check submission status once account is linked

    useEffect(() => {
        if (accountInfo) {
            processEligibility();
        }
    }, [accountInfo])

    if (isTwitterLinked) {
        return (
            <GridElement>
                <div><p>Twitter</p></div>
                <div>
                    <TwitterAccountBox>
                        <img style={{ borderRadius: '100px', maxWidth: '30px' }} src={twitterAccount.profile_image_url} />
                        <TwitterSwitchAccount onClick={() => onOpen('standard')}>edit</TwitterSwitchAccount>
                        <SubmissionStatus status={'pass'} key={`twitter-eligibility`} />
                    </TwitterAccountBox>
                </div>
            </GridElement>
        )
    }

    return (
        <GridElement>
            <div><p>Twitter</p></div>
            <div>
                <TwitterWrap>
                    <LinkTwitter minimal setError={setError} auth_type={'standard'} auth_error={auth_error} onOpen={onOpen} customButton={true} clearErrors={() => setError(null)} />
                    <SubmissionStatus status={'fail'} key={`twitter-eligibility`} />
                </TwitterWrap>
            </div>
        </GridElement>
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
import { ParseBlocks } from "../block-parser";
import { Label } from "../../common/common_styles";
import { labelColorOptions } from "../../common/common_styles";
import SubmissionBuilder from "../submissions/submission-builder";
import useSubmissionEngine from "../../../../hooks/useSubmissionEngine";
import { useWalletContext } from "../../../../../app/WalletContext";
import { selectContestSettings, selectPromptData } from "../interface/contest-interface-reducer";
import { useSelector } from "react-redux";
import {
    PromptWrap,
    PromptTop,
    PromptContent,
    PromptCoverImage,
    SubmissionRequirements,
    RestrictionStatus,
    RestrictionStatusNotConnected,
    SubButton,
    ConnectWalletButton,
    AltSubmissionButton,
    FadeDiv
} from "./styles";



export default function ExpandedPrompt({ isCreating, setIsCreating, handleClose }) {
    const { walletConnect } = useWalletContext();
    const prompt_data = useSelector(selectPromptData)
    const contest_settings = useSelector(selectContestSettings)
    const { isWalletConnected, alreadySubmittedError, restrictionResults, isUserEligible } = useSubmissionEngine(contest_settings.submitter_restrictions);

    const handleCreateSubmission = () => {
        setIsCreating(true);
    }

    const handleExitSubmission = () => {
        setIsCreating(false);
    }


    if (!isCreating) {
        return (
            <>
                <SubmissionRequirements>
                    <h2 style={{ marginBottom: '30px', marginTop: '20px' }}>Submission Requirements</h2>
                    <p >Limit 1 submission <RestrictionStatus isConnected={isWalletConnected} status={!alreadySubmittedError} key={`${isWalletConnected}-already-submitted`} /></p>
                    {restrictionResults.map((restriction, index) => {
                        if (restriction.type === 'erc20' || restriction.type === 'erc721') {
                            return (
                                <>
                                    <p>
                                        {restriction.threshold} {restriction.symbol}
                                        {isWalletConnected && <RestrictionStatus index={index + 1} isConnected={isWalletConnected} status={restriction.user_result} key={`${isWalletConnected}-${restriction.user_result}`} />}
                                        {!isWalletConnected && <RestrictionStatusNotConnected />}
                                    </p>
                                    {index !== Object.entries(restrictionResults).length - 1 && <p>or</p>}
                                </>
                            )
                        }
                    })}


                    <SubButton>
                        {!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>Connect Wallet</ConnectWalletButton>}
                        <AltSubmissionButton disabled={!isUserEligible} onClick={handleCreateSubmission}>Create Submission</AltSubmissionButton>
                    </SubButton>
                </SubmissionRequirements>
                <PromptWrap>
                    <PromptTop>
                        <h3>{prompt_data.title}</h3>
                        <Label color={labelColorOptions[prompt_data.promptLabelColor]}>{prompt_data.promptLabel}</Label>
                    </PromptTop>
                    <PromptContent>
                        <PromptCoverImage src={prompt_data.coverImage} />
                        <ParseBlocks data={prompt_data.editorData} />
                    </PromptContent>
                </PromptWrap>


            </>
        )
    }
    else {
        return (
            <FadeDiv>
                <SubmissionBuilder handleExitSubmission={handleExitSubmission} restrictionResults={restrictionResults} isUserEligible={isUserEligible} handleCloseDrawer={handleClose} />
            </FadeDiv>
        )
    }
}


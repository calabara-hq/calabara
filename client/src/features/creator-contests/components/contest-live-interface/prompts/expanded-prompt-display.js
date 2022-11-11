import { useSelector } from "react-redux";
import { useWalletContext } from "../../../../../app/WalletContext";
import useSubmissionEngine from "../../../../hooks/useSubmissionEngine";
import { Label, labelColorOptions } from "../../common/common_styles";
import { ParseBlocks } from "../block-parser";
import SubmissionQualifications from "../contest-state-info/submission-qualifications";
import { selectContestSettings, selectContestState, selectPromptData } from "../interface/contest-interface-reducer";
import SubmissionBuilderInterfaceController from "../submissions/submission-builder/submission-builder-interface-ctr";
import {
    FadeDiv, PromptContent,
    PromptCoverImage, PromptTop, PromptWrap, QualificationsWrap
} from "./styles";



export default function ExpandedPrompt({ isCreating, setIsCreating, handleClose }) {
    const { walletConnect } = useWalletContext();
    const prompt_data = useSelector(selectPromptData)
    const contest_settings = useSelector(selectContestSettings)
    const { isWalletConnected, alreadySubmittedError, restrictionResults, isUserEligible } = useSubmissionEngine(contest_settings.submitter_restrictions);
    const contest_state = useSelector(selectContestState)

    const handleCreateSubmission = () => {
        setIsCreating(true);
    }

    const handleExitSubmission = () => {
        setIsCreating(false);
    }

    if (!isCreating) {
        return (
            <>
                {contest_state === 0 &&
                    <QualificationsWrap>
                        <SubmissionQualifications submitOnClick={handleCreateSubmission} />
                    </QualificationsWrap>
                }
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
                <SubmissionBuilderInterfaceController handleExitSubmission={handleExitSubmission} restrictionResults={restrictionResults} isUserEligible={isUserEligible} handleCloseDrawer={handleClose} />
            </FadeDiv>
        )
    }
}


import { useSelector } from "react-redux";
import { Label, labelColorOptions } from "../../common/common_styles";
import { ParseBlocks } from "../block-parser";
import SubmissionQualifications from "../contest-state-info/submission-qualifications";
import { selectContestState, selectPromptData } from "../interface/contest-interface-reducer";
import SubmissionBuilderInterfaceController from "../submissions/submission-builder/submission-builder-interface-ctr";
import Zoom from 'react-medium-image-zoom'
import '../../../../../css/image-zoom.css'

import {
    ExpandedCoverImage,
    FadeDiv, PromptContent, PromptTop, PromptWrap, QualificationsWrap
} from "./styles";



export default function ExpandedPrompt({ isCreating, setIsCreating, handleClose }) {
    const prompt_data = useSelector(selectPromptData)
    const contest_state = useSelector(selectContestState)

    const handleCreateSubmission = () => {
        setIsCreating(true);
    }

    const handleExitSubmission = () => {
        setIsCreating(false);
    }

    const handleImageZoom = () => {

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
                        <Zoom><ExpandedCoverImage src={prompt_data.coverImage} /></Zoom>
                        <ParseBlocks data={prompt_data.editorData} withZoom />
                    </PromptContent>
                </PromptWrap>


            </>
        )
    }
    else {
        return (
            <FadeDiv>
                <SubmissionBuilderInterfaceController handleExitSubmission={handleExitSubmission} handleCloseDrawer={handleClose} />
            </FadeDiv>
        )
    }
}


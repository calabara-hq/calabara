import { useSelector } from "react-redux";
import { selectContestSettings } from "../../interface/contest-interface-reducer";
import StandardSubmissionBuilder from "./standard-submission-builder/standard-submission-builder";
import TwitterSubmissionBuilder from "./twitter-submission-builder/twitter-submission-builder";

export default function SubmissionBuilderInterfaceController({ handleExitSubmission, isUserEligible, handleCloseDrawer }) {
    const contest_settings = useSelector(selectContestSettings)

    if(contest_settings.twitter_integration){
        return <TwitterSubmissionBuilder handleExitSubmission={handleExitSubmission} isUserEligible={isUserEligible} handleCloseDrawer={handleCloseDrawer}/>
    }

    return <StandardSubmissionBuilder handleExitSubmission={handleExitSubmission} isUserEligible={isUserEligible} handleCloseDrawer={handleCloseDrawer}/>
}

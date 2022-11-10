import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectWalletAddress } from "../../../../../app/sessionReducer";
import { Contest_h4 } from "../../common/common_styles";
import { selectContestState } from "../interface/contest-interface-reducer";
import { ExpandedPromptComponent } from "../prompts/prompt-display";
import { DataWrap, Container, GridElement, WinnersButton } from "./styles";
import SubmissionQualifications from "./submission-qualifications";
import VotingData from "./voting-data";
import VotingQualifications from "./voting-qualifications";

export default function ContestStateInfo() {
    return (
        <Container>
            <StateController />
        </Container>
    )
}


function StateController() {
    const contest_state = useSelector(selectContestState)
    const isWalletConnected = useSelector(selectWalletAddress)
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



    if (contest_state === 0) {
        return (
            <>
                <SubmissionQualifications showTwitter submitOnClick={handleDrawerOpen} />
                <ExpandedPromptComponent isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose} isCreating={isCreating} setIsCreating={setIsCreating} />
            </>
        )
    }
    else if (contest_state === 1) {
        if (isWalletConnected) return <VotingData />
        else return <VotingQualifications />
    }
    else if (contest_state === 2) {
        return <Winners />
    }
}



function Winners() {
    const { ens, contest_hash } = useParams();
    
    const handleDownloadCsv = async () => {
        let csv_data = await fetch(`/creator_contests/fetch_contest_winners_as_csv?ens=${ens}&contest_hash=${contest_hash}`)
            .then(res => res.text())

        var encodedUri = encodeURI(csv_data);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "winners.csv");
        document.body.appendChild(link); // Required for FF
        link.click();

    }
    return (
        <DataWrap>
            <GridElement>
        
                <div style={{ color: '#b3b3b3' }}><Contest_h4>Winners</Contest_h4></div>
                <div><WinnersButton onClick={handleDownloadCsv}>Download Winners</WinnersButton></div>
            </GridElement>
        </DataWrap>
    )
}
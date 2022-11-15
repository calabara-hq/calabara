import axios from 'axios';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIsConnected, selectWalletAddress } from "../../../../../app/sessionReducer";
import { socket } from "../../../../../service/socket";
import { Contest_h4 } from "../../common/common_styles";
import { selectContestState, setRemainingVotingPower, setTotalVotingPower } from "../interface/contest-interface-reducer";
import { ExpandedPromptComponent } from "../prompts/prompt-display";
import { Container, DataWrap, GridElement, WinnersButton } from "./styles";
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
    const contest_state = 0//useSelector(selectContestState)
    const isWalletConnected = useSelector(selectIsConnected)
    const walletAddress = useSelector(selectWalletAddress)
    const [isCreating, setIsCreating] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { ens, contest_hash } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isWalletConnected) {
            if (contest_state === 0) {
                initializeSubmissionStatusListener();
            }
            else if (contest_state === 1) {
                initializeVotingData();
            }
        }

    }, [isWalletConnected, contest_state])



    const initializeSubmissionStatusListener = () => {
        socket.emit('user-subscribe', `${contest_hash}-${walletAddress}`)
    }


    const initializeVotingData = () => {
        axios.post('/creator_contests/user_total_voting_metrics', { ens: ens, contest_hash: contest_hash, walletAddress: walletAddress })
            .then(res => res.data)
            .then(result => {
                dispatch(setTotalVotingPower(result.metrics.contest_total_vp))
                dispatch(setRemainingVotingPower(result.metrics.contest_remaining_vp))

            })
    }


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
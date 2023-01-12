import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSelector } from "react-redux";
import DrawerComponent from "../../../../drawer/drawer";
import { Contest_h4 } from "../../common/common_styles";
import ContestSummaryComponent from "../../contest-details/detail-components";
import { SummaryWrap } from "../../contest-details/detail-style";
import { selectContestSettings, selectRemainingVotingPower, selectTotalVotingPower } from "../interface/contest-interface-reducer";
import { DataGrid, DataWrap, GridElement } from "./styles";
let compact_formatter = Intl.NumberFormat('en', { notation: 'compact' })


export default function VotingData() {
    const contest_settings = useSelector(selectContestSettings);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const remaining_vp = useSelector(selectRemainingVotingPower);
    const total_available_vp = useSelector(selectTotalVotingPower);


    const handleDrawerOpen = () => {
        setDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        document.body.style.overflow = 'unset';
    }


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
import { useEffect, useRef, useState, useMemo } from "react";
import styled from 'styled-components'
import { ParseBlocks, parse_base_js } from "../../block-parser";
import { SubmissionVotingBox } from "../../vote/voting-components";
import DrawerComponent from "../../../../../drawer/drawer";
import { selectContestState } from "../../interface/contest-interface-reducer";
import { useSelector } from "react-redux";
import { fade_in } from "../../../common/common_styles";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Author, SubmissionMeta, VoteTotals } from "./submission-display-styles";
import { Anchorme } from 'react-anchorme';



const DrawerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 95%;
    margin: 0 auto;
    margin-left: 20px;
    margin-top: 50px;
    height: 100%;
    color: #d3d3d3;
    animation: ${fade_in} 0.4s ease-in-out;

    > * {
        margin-bottom: 30px;
    }

`
const SubmissionWrap = styled.div`
    align-items: flex-start;
    background-color: #262626;
    border-radius: 10px;
    padding: 10px;
    word-wrap: break-word;
    text-align: center;
    animation: ${fade_in} 0.5s ease-in;

    > h2 {
        color: #d9d9d9;
        text-align: left;
    }
    
    > p {
        font-size: 15px;
        color: #d3d3d3;
        text-align: left;

    }

    img {
        max-width: 35em;
        border-radius: 10px;
        align-self: center;
        justify-self: center;
        border-radius: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }

    @media screen and (max-width: 500px){
        img{
            max-width: 20em !important;
        }
    }

    > * {
        margin-top: 20px;
        margin-bottom: 20px;


    }
    
`
const LazyLoadImageContainer = styled.div`
    img {
        max-width: 35em;
        border-radius: 10px;
    }

    

`

export default function ExpandSubmissionDrawer({ drawerOpen, handleClose, id, TLDRImage, TLDRText, expandData, author, votes }) {
    const contest_state = useSelector(selectContestState)

    return (
        <DrawerComponent drawerOpen={drawerOpen} handleClose={handleClose} showExit={true}>
            {contest_state === 1 && <SubmissionVotingBox sub_id={id} />}
            <SubmissionWrap>
                <>
                    {contest_state === 2 &&
                        <SubmissionMeta width={'100%'}>
                            {author && <Author>{author.substring(0, 6)}...{author.substring(38, 42)}</Author>}
                            {votes !== null && <VoteTotals>{votes} votes</VoteTotals>}
                        </SubmissionMeta>
                    }
                </>
                <p><Anchorme target="_blank">{TLDRText}</Anchorme></p>
                <LazyLoadImage src={TLDRImage} effect="opacity" />
                {expandData && <ParseBlocks data={expandData} />}
            </SubmissionWrap>
        </DrawerComponent>

    )
}

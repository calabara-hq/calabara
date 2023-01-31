import { Anchorme } from 'react-anchorme';
import { LazyLoadImage } from "react-lazy-load-image-component";
import Zoom from 'react-medium-image-zoom';
import { useSelector } from "react-redux";
import styled from 'styled-components';
import '../../../../../../css/image-zoom.css';
import DrawerComponent from "../../../../../drawer/drawer";
import { fade_in } from "../../../common/common_styles";
import { ParseBlocks } from "../../block-parser";
import { selectContestState } from "../../interface/contest-interface-reducer";
import { SubmissionVotingBox } from "../../vote/voting-components";
import { Author, SubmissionMeta, VoteTotals } from "./submission-display-styles";
import { scaleElement } from '../../../../../../css/scale-element';

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

const ViewThreadButton = styled.button`
    background-color: rgba(29, 155, 240, 0.8);
    border: none;
    border-radius: 10px;
    padding: 5px 20px;
    font-weight: bold;
    align-self: flex-end;
    ${scaleElement};
`


export default function ExpandSubmissionDrawer({ drawerOpen, handleClose, id, TLDRImage, TLDRText, expandData, author, metadata, votes }) {
    const contest_state = useSelector(selectContestState)
    console.log(metadata)
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
                {metadata ? <ViewThreadButton onClick={() => window.open(`https://twitter.com/web/status/${metadata.tweet_id}`)}>view thread</ViewThreadButton> : null}
                <Zoom><LazyLoadImage src={TLDRImage} effect="opacity" /></Zoom>
                {expandData && <Anchorme><ParseBlocks data={expandData} /></Anchorme>}
            </SubmissionWrap>
        </DrawerComponent>

    )
}

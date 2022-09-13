import { useEffect, useState } from "react";
import styled from 'styled-components'
import { ParseBlocks, parse_base_js } from "../block-parser";
import { SubmissionVotingBox } from "../vote/voting-components";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { selectContestState } from "../interface/contest-interface-reducer";
import { useSelector } from "react-redux";
import { fade_in } from "../../common/common_styles";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Author, SubmissionMeta, VoteTotals } from "./submission-styles";
import Placeholder from "../../common/spinner";

const ToolbarTop = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    
`

const ExitButton = styled.button`
    font-weight: bold;
    background-color: #2d2e35;
    color: lightcoral;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    margin-left: auto;

`


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
    animation: ${fade_in} 0.5s ease-in-out;

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

    > img {
        max-width: 35em;
        align-self: center;
        justify-self: center;
        border-radius: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }

    > * {
        margin-top: 20px;
        margin-bottom: 20px;
        margin-right: 30px;


    }
    
`



const AuthorSpan = styled.span`
    position: absolute;
    right: 0;
    top: 0;
    border: double 2px transparent;
    border-radius: 40px;
    background-image: linear-gradient(#24262e, #24262e), linear-gradient(to right, #e00f8e, #2d66dc);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
    padding: 5px;
`
export default function ExpandSubmissionDrawer({ drawerOpen, handleClose, id, TLDRImage, TLDRText, expandData, author, votes }) {
    const contest_state = useSelector(selectContestState)
    const [first_render, set_first_render] = useState(true);

    useEffect(() => {
        set_first_render(false);
    }, [])

    return (

        <Drawer
            open={drawerOpen}
            onClose={handleClose}
            direction='right'
            className='expand_sub'
            size='60vw'
            style={{ backgroundColor: '#1e1e1e', overflowY: 'scroll' }}
        >
            {first_render && <div>loading</div>}
            {!first_render &&
                <DrawerWrapper>
                    {contest_state === 1 && <SubmissionVotingBox sub_id={id} />}
                    <SubmissionWrap>
                        <>
                            {contest_state === 2 &&
                                <SubmissionMeta>
                                    {author && <Author>{author.substring(0, 6)}...{author.substring(38, 42)}</Author>}
                                    {votes !== null && <VoteTotals>{votes} votes</VoteTotals>}
                                </SubmissionMeta>
                            }
                        </>
                        <p>{TLDRText}</p>
                        {/*<LazyLoadImage style={{ maxWidth: '35em', margin: '0 auto', borderRadius: '10px' }} src={TLDRImage} effect="blur"/>*/}
                        <LazyLoadImage src={TLDRImage} effect="blur" style={{maxWidth: '35em', borderRadius: '10px'}}/>
                        {expandData && <ParseBlocks data={expandData} />}
                    </SubmissionWrap>
                </DrawerWrapper>
            }
        </Drawer>
    )
}


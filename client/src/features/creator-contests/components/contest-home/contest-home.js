import { Suspense, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { useParams, useHistory } from "react-router-dom";
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import BackButton from "../../../back-button/back-button";
import { Label, labelColorOptions, Contest_h2_alt, Contest_h3_alt, TagType, fade_in } from "../common/common_styles";
import { label_status } from "../contest-live-interface/contest_info/contest-info-style";
import CC_Logo from "../../../../img/logo-cc-shark.png"
import moment from "moment";
import useCommon from "../../../hooks/useCommon";
import { selectDashboardInfo } from "../../../dashboard/dashboard-info-reducer";
import { selectLogoCache } from "../../../org-cards/org-cards-reducer";
import * as WebWorker from '../../../../app/worker-client.js'
import fetchHomepageData from "./homepage-data-fetch";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
let compact_formatter = Intl.NumberFormat('en', { notation: 'compact' })


const ContestTag = styled.p`
    color: #d9d9d9;
    font-size: 1.5em;
    cursor: pointer;
    margin: 0;
    padding: 5px;

    @media screen and (max-width: 600px){
        font-size: 1.2em;
    }

    @media screen and (max-width: 500px){
        font-size: 1em;
    }
`

const ContestHomeWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 70vw;
    margin: 0 auto;
    @media screen and (max-width: 700px){
        width: 80vw;
    }

`

const SplitTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: -10px;
    flex-wrap: wrap;
    margin-bottom: 10px;
    > * {
        margin: 10px;
    }
    
    
 `

const HomeLeft = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0 1 25%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #1e1e1e;
    border-radius: 10px;

`

const OrgImg = styled.img`
    max-width: 10em;
    border: none;
    border-radius: 100px;
    //margin-bottom: 10px;
`

const HomeRight = styled.div`
    display: flex;
    flex: 0 0 70%;
    flex-direction: column;
    align-items: center;
    justify-content: center;   
    background-color: #1e1e1e;
    border-radius: 10px;
    margin-left: 20px;
    padding: 20px;
    > img {
        max-width: 25em;
    }
    > h3 {
        color: #bfbfbf;
    }

`

const RoundContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    justify-content: center;
    align-content: flex-start;
    height: fit-content;
    background-color: #1e1e1e;
    border-radius: 10px;
    animation: ${fade_in} 0.4s ease-in-out;

`

const Contest = styled.div`
    display: flex;
    align-items: center;
    width: 95%;
    color: #d3d3d3;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 5px;
    margin: 10px;
    grid-gap: 20px;
    cursor: pointer;
    transition: visibility 0.2s, max-height 0.3s ease-in-out;

    &:hover{
        background-color: #1e1e1e;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
        transform: scale(1.01);
        transition-duration: 0.5s;

    }

`

const SplitBottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: -10px;
    flex-wrap: wrap-reverse;
    margin-bottom: 70px;
    > * {
        margin: 10px;
    }
    
`

const SplitBottomRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1 1 25%;
`

const SplitBottomLeft = styled.div`
    flex: 1 1 70%;
    display: flex;
`

const NewContest = styled.button`
    position: absolute;
    right: 10px;
    bottom: 10px;
    margin-left: auto;
    font-size: 15px;
    border: 2px solid #539bf5;
    border-radius: 10px;
    background-color: #1e1e1e;
    color: #d3d3d3;
    padding: 10px 15px;
    font-weight: bold;
    width: 25em;
    &:hover{
        transform: scale(1.01);
    }
    &:active{
        transform: scale(0.9);
    }
    @media screen and (max-width: 800px){
        width: 98%;
        right: 0;
        left: 0;
        margin: 0 auto;
        bottom: 0px;
    }

`

const StatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 250px;
    justify-content: space-evenly;
    align-items: center;
    background-color: #1e1e1e;
    border-radius: 10px;
    margin-top: 20px;
    animation: ${fade_in} 0.4s ease-in-out;

`

const Stats = styled.div`
    display: flex;
    flex-direction: column;
    margin: -10px;
    width: 200px;

`

const OptionType = styled.div`
    display: flex;
    color: lightgrey;
    margin: 10px;
    align-items: center;


    > p {
        margin: 0;
        margin-left: auto;
        font-weight: bold;
    }

    & > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`

const OrgCard = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 25%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #1e1e1e;
    border-radius: 10px;
    min-height: 280px;
    animation: ${fade_in} 0.2s ease-in-out;
    > * {
        margin: 10px;
        animation: ${fade_in} 1s ease-in-out;
    }

`
const AboutCC = styled.div`
    position: relative;
    flex: 1 0 70%;
    height: 290px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    animation: ${fade_in} 0.2s ease-in-out;
    color: #d3d3d3;
    
    > div{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 90%;
        img{
            
            max-width: 25em;
            margin-left: auto;
            margin-right: 10px;
        }
        h2{
            justify-self: flex-start;
            align-self: center;
            text-align: left;
        }
    }

    h4 {
        color: #a3a3a3;
        max-width: 600px;
    }

    @media screen and (max-width: 1400px){
        > div{
            h2{
                font-size: 1.8em;
            }
            img{
                max-width: 20em;
            }
        } 
    }

    @media screen and (max-width: 800px){
        
        height: 350px;
        text-align: center;
        > div{
            flex-direction: column-reverse;
            align-items: center;
            h2{
                font-size: 1.5em;
            }
            img{
                max-width: 20em;
                margin: 0 auto;
            }
        }
        
        h4{
            font-size: 1.2em;
        }
    }

    @media screen and (max-width: 800px){
        height: 350px;
    }
`

export default function ContestHomepage({ }) {
    const { ens } = useParams();
    const history = useHistory();
    const { batchFetchDashboardData } = useCommon()
    const info = useSelector(selectDashboardInfo)
    const logoCache = useSelector(selectLogoCache);
    const dispatch = useDispatch()
    const homepage_data = fetchHomepageData(ens);





    // on page load, fetch all the contests for this org and display.
    // if one is clicked, set the contest_hash in the url and fetch the settings

    useEffect(() => {

        batchFetchDashboardData(ens, info)
    }, [])

    useEffect(() => {
        if (info.ens == ens) {
            WebWorker.processImages(dispatch, logoCache);

        }
    }, [info])


    const handleSettings = () => {
        history.push(`contest_settings`)
    }


    if (ens === 'sharkdao.eth') {
        return (
            <>
                <BackButton customWidth={'68%'} link={'/' + ens + '/dashboard'} text={"dashboard"} />
                <ContestHomeWrap>
                    <SplitTop>
                        <RenderOrgCard info={info} />
                        {/**/}
                        <AboutCC>
                            <div>
                                <h4>Participate in weekly contests to recieve retroactive funding for your most creative artwork, ideas, memes, and everything else.</h4>
                                <img src={CC_Logo} />
                            </div>
                            <NewContest onClick={handleSettings}><FontAwesomeIcon icon={faPlus} /> New Contest </NewContest>
                        </AboutCC>
                    </SplitTop>
                    <SplitBottom>
                        <SplitBottomLeft>
                            <Suspense fallback={<RoundContainer style={{ height: '500px' }} />}>
                                <ListContests homepage_data={homepage_data} />
                            </Suspense>
                        </SplitBottomLeft>

                        <SplitBottomRight>
                            <Suspense fallback={<StatContainer style={{ height: '230px' }} />}>
                                <ListStats homepage_data={homepage_data} />
                            </Suspense>
                        </SplitBottomRight>

                    </SplitBottom>
                </ContestHomeWrap>
            </>
        )
    }

    // else
    return (
        <>
            <BackButton customWidth={'68%'} link={'/' + ens + '/dashboard'} text={"dashboard"} />
            <ContestHomeWrap>
                <SplitTop>
                    <HomeLeft>
                        <OrgImg data-src={info.logo}></OrgImg>
                        <Contest_h2_alt>{info.name}</Contest_h2_alt>
                        <a href={'//' + info.website} target="_blank">{info.website}</a>
                    </HomeLeft>
                    <HomeRight>
                        <h3>Interested in creator contests? Hit us up in our Discord.</h3>
                        <a href="https://discord.gg/dBBzHe9k3E" target={"_blank"} style={{ textAlign: 'center', fontSize: '35px' }}><FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon></a>
                    </HomeRight>
                </SplitTop>
            </ContestHomeWrap>
        </>
    )
}

function ListContests({ homepage_data }) {
    const history = useHistory();
    const all_contests = homepage_data.contests.read();

    const handleInterface = (_hash) => {
        history.push(`creator_contests/${_hash}`)
    }


    return (
        <RoundContainer>
            {all_contests.map(el => {
                return (
                    <Contest onClick={() => handleInterface(el._hash)}>
                        <ContestTag>{el._title}</ContestTag>
                        <Label color={labelColorOptions[el._prompt_label_color]}>{el._prompt_label}</Label>
                        <CalculateState contest_info={el} />
                    </Contest>
                )
            })}
        </RoundContainer>
    )
}

function ListStats({ homepage_data }) {
    const total_rewards = homepage_data.stats.read();
    console.log(total_rewards)
    return (
        <StatContainer>
            <Contest_h3_alt style={{ textAlign: 'center' }}>Total Rewards Distributed</Contest_h3_alt>
            <Stats>
                <OptionType><TagType>ETH</TagType> <p>{total_rewards.eth ? compact_formatter.format(total_rewards.eth) : '--'}</p></OptionType>
                <OptionType><TagType type='erc20'>ERC-20</TagType> <p>{total_rewards.erc20 ? compact_formatter.format(total_rewards.erc20) : '--'}</p></OptionType>
                <OptionType><TagType type='erc721'>ERC-721</TagType><p>{total_rewards.erc721 ? compact_formatter.format(total_rewards.erc721) : '--'}</p></OptionType>
            </Stats>
        </StatContainer>
    )
}

const calculateDuration = (t0, t1, t2) => {
    let submit_time = moment.duration(moment(t0).diff(moment()));
    let vote_time = moment.duration(moment(t1).diff(moment()))
    let end_time = moment.duration(moment(t2).diff(moment()))
    submit_time = vote_time.milliseconds() > 0 ? 'active' : 'complete';
    vote_time = submit_time === 'complete' ? (end_time.milliseconds() > 0 ? 'active' : 'complete') : `${vote_time.days()}:${vote_time.hours()}:${vote_time.minutes()}:${vote_time.seconds()}`
    end_time = end_time.milliseconds() > 0 ? `${end_time.days()}:${end_time.hours()}:${end_time.minutes()}:${end_time.seconds()}` : 'complete'

    return [
        submit_time,
        vote_time,
        end_time
    ]
}

function CalculateState({ contest_info }) {
    const [contestState, setContestState] = useState(0)



    useEffect(() => {

        let results = calculateDuration(contest_info._start, contest_info._voting, contest_info._end)

        let index = results.indexOf('active');
        let cc_state = index = index > -1 ? index : 2;
        setContestState(cc_state)
    }, [])


    return (
        <Label style={{ marginLeft: 'auto' }} color={label_status[contestState]}>{label_status[contestState].status}</Label>
    )
}

function RenderOrgCard({ info }) {

    if (!info) {
        return (
            <OrgCard >
                <p>loading</p>
            </OrgCard>
        )
    }

    return (
        <OrgCard>
            <LazyLoadImage style={{ maxWidth: '12em', margin: '0 auto', borderRadius: '100px' }} src={`/${info.logo}`} effect="blur" />
            <Contest_h2_alt>{info.name}</Contest_h2_alt>
            <a href={'//' + info.website} target="_blank">{info.website}</a>
        </OrgCard>
    )
}
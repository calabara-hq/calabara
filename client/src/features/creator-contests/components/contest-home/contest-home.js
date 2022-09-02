import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { useParams, useHistory } from "react-router-dom";
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import BackButton from "../../../back-button/back-button";
import { Label, labelColorOptions, Contest_h2_alt, Contest_h3_alt, TagType } from "../common/common_styles";
import { label_status, OrgImg } from "../contest-live-interface/contest_info/contest-info-style";
import contestInterfaceReducer, { selectContestState } from "../contest-live-interface/interface/contest-interface-reducer";
import { contest_data } from "../contest-live-interface/temp-data";
import CreatorContestLogo from "../../../../img/cc.png"
import moment from "moment";
import useCommon from "../../../hooks/useCommon";
import { selectDashboardInfo } from "../../../dashboard/dashboard-info-reducer";
import { selectLogoCache } from "../../../org-cards/org-cards-reducer";
import * as WebWorker from '../../../../app/worker-client.js'


const ContestTag = styled.p`
    color: #d9d9d9;
    font-size: 20px;
    cursor: pointer;
    margin: 0;
    padding: 5px;
`

const ContestHomeWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 70vw;
    margin: 0 auto;

`

const ContestHomeSplit = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 250px;
    margin-bottom: 20px;
    
    
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

const OrgImgTo = styled.img`
    max-width: 10em;
    border: none;
    border-radius: 100px;
    //margin-bottom: 10px;
`

const HomeRight = styled.div`
    display: flex;
    flex: 0 0 70%;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;   
    background-color: #1e1e1e;
    border-radius: 10px;
    margin-left: 20px;
    padding: 20px;


`

const TopText = styled.div` 
    display: flex;
    flex-direction: column;


    > h3 {
        font-size: 25px;
        color: #d9d9d9;
        text-align: center;
        margin: 0px 0px 10px 0px;
    }
    > li{
        font-size: 15px;
        color: pink;
        text-align: left;

    }




`

const TopRight = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 40%;
    align-items: center;
    justify-content: center;

    > h1 {
        color: #d9d9d9;
        font-size: 35px;
        
    }

    > img {
        max-width: 80%;
        max-height: 90%;

    }

`

const SplitBottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 70px;



`

const RoundContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    flex: 0 0 70%;
    height: fit-content;
    background-color: #1e1e1e;
    border-radius: 10px;
    margin-right: 20px;

`

const RoundWrap = styled.div`
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

const SplitBotR = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 0 0 25%;

`

const NewContest = styled.button`
    font-size: 16px;
    font-weight: 550;
    color: rgb(6, 214, 160);
    background-color: rgb(6, 214, 160, .3);
    border: 2px solid transparent;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 10px;
    transition: background-color 0.2s ease-in-out;
    transition: color 0.3s ease-in-out;
    transition: visibility 0.2s, max-height 0.3s ease-in-out;

    &:hover{
        transform: scale(1.01);
        transition-duration: .5s;
        background-color: rgb(6, 214, 160);
        color: #fff;
    }

`

const StatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 250px;
    justify-content: space-evenly;
    align-items: center;
    background-color: #1e1e1e;
    //border: 2px solid #4d4d4d;
    border-radius: 10px;
    //margin-right: 10px;
    margin-top: 20px;

    > p {
        color: #d9d9d9;
        font-weight: 550;

    }

    > *{
        text-align: center;
    }

`

const OptionType = styled.p`
    color: lightgrey;
    margin: 10px 0;

    & > span{
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`





export default function ContestHomepage({ }) {
    const [all_contests, set_all_contests] = useState(null);
    const [contest_hash, set_contest_hash] = useState(null);
    const [total_rewards, set_total_rewards] = useState([0, 0, 0])
    const { ens } = useParams();
    const history = useHistory();
    const { batchFetchDashboardData } = useCommon()
    const info = useSelector(selectDashboardInfo)
    const logoCache = useSelector(selectLogoCache);
    const dispatch = useDispatch()





    // on page load, fetch all the contests for this org and display.
    // if one is clicked, set the contest_hash in the url and fetch the settings

    useEffect(() => {
        (async () => {
            batchFetchDashboardData(ens, info)
            let res = await axios.get(`/creator_contests/fetch_org_contests/${ens}`);
            set_all_contests(res.data)
            let stats = await axios.get(`/creator_contests/org_contest_stats/${ens}`);
            set_total_rewards([stats.data.eth, stats.data.erc20, stats.data.erc721])

        })();
    }, [])

    useEffect(() => {
        if (info.ens == ens) {
            WebWorker.processImages(dispatch, logoCache);

        }
    }, [info])



    const handleInterface = (_hash) => {
        history.push(`creator_contests/${_hash}`)
    }

    const handleSettings = () => {
        history.push(`contest_settings`)
    }


    return (
        <>
            <BackButton link={'/' + ens + '/dashboard'} text={"dashboard"} />
            <ContestHomeWrap>
                <ContestHomeSplit>
                    <HomeLeft>
                        <OrgImgTo data-src={info.logo}></OrgImgTo>
                        <Contest_h2_alt>{info.name}</Contest_h2_alt>
                        <a href={'//' + info.website} target="_blank">{info.website}</a>
                    </HomeLeft>
                    <HomeRight>
                        <TopText>
                        <h3>Earn Retroactive Rewards through contributions</h3>
                        <li>Incentivize creatives, artists, and builders</li>
                        <li>Path to membership via proof of work</li>
                        <li>Attract more creatives to the ecosystem</li>
                        <li>Gamify collaboration amongst community members</li>
                        <li>Curate excellent contributions</li>
                        <li>Increase governane participation</li>
                        <li>Most importantly, HAVE FUN :)</li>

                        </TopText>
                        <TopRight>
                            <img src={CreatorContestLogo} />
                        </TopRight>
                    </HomeRight>
                </ContestHomeSplit>
                <SplitBottom>
                    {all_contests &&
                        <RoundContainer>
                            {all_contests.map((el, index) => {
                                return (
                                    <RoundWrap onClick={() => handleInterface(el._hash)}>
                                        <ContestTag>{el._title}</ContestTag>
                                        <Label color={labelColorOptions[el._prompt_label_color]}>{el._prompt_label}</Label>
                                        <CalculateState contest_info={el} />
                                    </RoundWrap>


                                )

                            })}

                        </RoundContainer>
                    }
                    <SplitBotR>
                        <NewContest onClick={handleSettings}><FontAwesomeIcon icon={faPlus} /> New Contest </NewContest>

                        <StatContainer>
                            <Contest_h3_alt>Total Rewards Distributed: </Contest_h3_alt>
                            <OptionType><TagType>ETH:</TagType> {total_rewards[0] ? total_rewards[0] : '--'}</OptionType>
                            <OptionType><TagType type='erc20'>ERC-20:</TagType> {total_rewards[1] ? total_rewards[1].symbol : '--'}</OptionType>
                            <OptionType><TagType type='erc721'>ERC-721:</TagType>  {total_rewards[2] ? total_rewards[2].symbol : '--'}</OptionType>
                        </StatContainer>
                    </SplitBotR>

                </SplitBottom>







            </ContestHomeWrap>
        </>
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
    console.log(contest_info)


    useEffect(() => {

        let results = calculateDuration(contest_info._start, contest_info._voting, contest_info._end)
        console.log(results)
        let index = results.indexOf('active');
        let cc_state = index = index > -1 ? index : 2;
        setContestState(cc_state)
    }, [])


    return (



        <Label style={{ marginLeft: 'auto' }} color={label_status[contestState]}>{label_status[contestState].status}</Label>



    )




}
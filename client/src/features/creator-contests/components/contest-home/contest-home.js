import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios'
import { useParams, useHistory } from "react-router-dom";
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';

import { OrgImg } from "../contest-live-interface/contest_info/contest-info-style";
import { Label, labelColorOptions, Contest_h3_alt } from "../common/common_styles";
import { label_status } from "../contest-live-interface/contest_info/contest-info-style";
import contestInterfaceReducer, { selectContestState } from "../contest-live-interface/interface/contest-interface-reducer";
import { contest_data } from "../contest-live-interface/temp-data";
import CreatorContestLogo from "../../../../img/creator-contest.png"
import moment from "moment";
import useCommon from "../../../hooks/useCommon";
import { selectDashboardInfo } from "../../../dashboard/dashboard-info-reducer";



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
    //border: 1px solid #22272e;
    //background-color: #22272e;
    border-radius: 10px;
    padding: 10px;
`

const ContestHomeSplit = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 300px;
    margin-bottom: 20px;
    margin-right: 10px;
    
 `

const HomeRight = styled.div`
    display: flex;
    flex: 0 0 70%;
    flex-direction: column;
    align-items: center;
    justify-content: center;   
    background-color: #1e1e1e;
    border-radius: 10px;
    margin-left: 10px;
    padding: 20px;

`

const TopRight = styled.div`
    display: flex;
    flex: 0 0 50%;
    flex-direction: column;
    align-items: center;
    width: 100%;
    //background-color: pink;
    margin-bottom: 10px;
    > img {
        max-width: 90%;
        max-height: 90%;


    }




`


const ImgWrap = styled.div`
    display: flex;
    flex: 0 0 25%;
    justify-content: center;
    border: 2px solid #4d4d4d;
    border-radius: 10px;

`

const SplitBottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;



`

const RoundContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex: 0 0 70%;
    background-color: #1e1e1e;
    border-radius: 10px;

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
    flex: 0 0 25%;





`

const ButContainer = styled.div`
    display: flex;
    flex: 0 0 25%;





`

const StatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 200px;
    justify-content: center;
    align-items: center;
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    margin-right: 10px;
    margin-top: 10px;



`
const NewContest = styled.button`
    font-size: 16px;
    font-weight: 550;
    color: rgb(6, 214, 160);
    background-color: rgb(6, 214, 160, .3);
    border: 2px solid transparent;
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 10px;
    margin-right: 10px;
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







export default function ContestHomepage({ }) {
    const [all_contests, set_all_contests] = useState(null);
    const [contest_hash, set_contest_hash] = useState(null);
    const [total_rewards, set_total_rewards] = useState([0, 0, 0])
    const { ens } = useParams();
    const history = useHistory();
    const { batchFetchDashboardData } = useCommon()
    const info = useSelector(selectDashboardInfo)



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


    const handleClick = (_hash) => {
        history.push(`creator_contests/${_hash}`)
    }
    return (
        <ContestHomeWrap>
            <ContestHomeSplit>
                <ImgWrap>
                <Contest_h3_alt>{info.name}</Contest_h3_alt>

                </ImgWrap>
                <HomeRight>
                    <TopRight>
                        <img src={CreatorContestLogo} />
                    </TopRight>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                </HomeRight>
            </ContestHomeSplit>
            <SplitBottom>
                {all_contests &&
                    <RoundContainer>
                        {all_contests.map((el, index) => {
                            return (
                                <RoundWrap onClick={() => handleClick(el._hash)}>
                                    <ContestTag>Contest {index + 1}</ContestTag>
                                    <Label color={labelColorOptions[0]}>label</Label>
                                    <CalculateState contest_info={el} />
                                </RoundWrap>


                            )

                        })}

                    </RoundContainer>
                }
                <SplitBotR>
                    <NewContest><FontAwesomeIcon icon={faPlus} /> New Contest </NewContest>

                    <StatContainer>
                        <h3>{info.name}</h3>
                        <p>ETH: {total_rewards[0] ? total_rewards[0] : '--'}</p>
                        <p>ERC-20: {total_rewards[1] ? total_rewards[1] : '--'}</p>
                        <p>ERC-721: {total_rewards[2] ? total_rewards[2] : '--'}</p>

                    </StatContainer>
                </SplitBotR>

            </SplitBottom>







        </ContestHomeWrap>
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
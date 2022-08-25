import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams, useHistory } from "react-router-dom";
import styled from 'styled-components'
import { OrgImg } from "../contest-live-interface/contest_info/contest-info-style";


const MyStyledParagraphTag = styled.p`
    color: lightblue;
    font-size: 20px;
    cursor: pointer;
`

const ContestHomeWrap = styled.div`
    width: 70vw;
    margin: 0 auto;
    border: 1px solid #22272e;
    //background-color: #22272e;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
`

const ContestHomeSplit = styled.div`
    height: 300px;
    width: 100%;
    display: flex;
    flex-direction: row;
    //padding-top: 20px;
    margin: 20px;
    
 `

const HomeRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70%;
    background-color: #1e1e1e;
    border-radius: 10px;
    margin: 20px;
    padding: 20px;

`


const ImgWrap = styled.div`
    display: flex;
    //height: 100%;
    width: 30%;
    justify-content: center;
    margin: auto;
    background-color: bisque;
    //margin: 20px;


`

const RoundContainer = styled.div`
    //display: flex;
    flex: 0 0 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-content: flex-start;
    align-items: center;

    width: 100%;
    background-color: #1e1e1e;
    border-radius: 10px;



`

const RoundWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 90%;
    color: #d3d3d3;
    background-color: #262626;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 5px;
    margin: 20px;
    grid-gap: 20px;
    cursor: pointer;
    margin-bottom: 10px;
    &:hover{
        transform: scale(1.01);
        transition-duration: 0.5s;

    }


`



export default function ContestHomepage({ }) {
    const [all_contests, set_all_contests] = useState(null);
    const [contest_hash, set_contest_hash] = useState(null);
    const { ens } = useParams();
    const history = useHistory();

    // on page load, fetch all the contests for this org and display.
    // if one is clicked, set the contest_hash in the url and fetch the settings

    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_org_contests/${ens}`);
            set_all_contests(res.data)
        })();
    }, [])

    const handleClick = (_hash) => {
        history.push(`creator_contests/${_hash}`)
    }
    return (
        <ContestHomeWrap>
            <ContestHomeSplit>
                <ImgWrap>
                <p>Whats goodie this is an image</p>
                </ImgWrap>
                <HomeRight>
                    <h2>Organization</h2>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                </HomeRight>
            </ContestHomeSplit>
            
            {all_contests && 
            <RoundContainer>
                {all_contests.map((el, index) => {
                    console.log(el)
                    return (
                        <RoundWrap>
                        <MyStyledParagraphTag onClick={() => handleClick(el._hash)}>Contest {index + 1}</MyStyledParagraphTag>
                        </RoundWrap>

                        
                    )
                })}
                </RoundContainer>
            }
            
            
        </ContestHomeWrap>
    )


}
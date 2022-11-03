import styled from 'styled-components'
import { scaleElement } from '../../../../css/scale-element'
import { fade_in } from '../common/common_styles'

export const ContestTag = styled.p`
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

export const ContestHomeWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 70vw;
    margin: 0 auto;
    @media screen and (max-width: 700px){
        width: 80vw;
    }

`

export const SplitTop = styled.div`
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

export const HomeLeft = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0 1 25%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #1e1e1e;
    border-radius: 10px;

`

export const OrgImg = styled.img`
    max-width: 10em;
    border: none;
    border-radius: 100px;
`

export const HomeRight = styled.div`
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

export const RoundContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    //justify-content: center;
    //align-content: flex-start;
    height: fit-content;
    background-color: #1e1e1e;
    border-radius: 10px;
    animation: ${fade_in} 0.4s ease-in-out;

`

export const Contest = styled.div`
    display: flex;
    align-items: center;
    width: 95%;
    margin: 10px auto;
    color: #d3d3d3;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    padding: 5px;
    grid-gap: 20px;
    cursor: pointer;
    ${scaleElement}
    &:hover{
        background-color: #1e1e1e;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);

    }

`

export const SplitBottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: -10px;
    flex-wrap: wrap;
    margin-bottom: 70px;
    > * {
        margin: 10px;
    }
    
`

export const SplitBottomRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1 1 25%;
`

export const SplitBottomLeft = styled.div`
    flex: 1 1 70%;
    display: flex;
`



export const NewContest = styled.button`
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
    ${scaleElement}



    @media screen and (max-width: 800px){
        width: 98%;
        right: 0;
        left: 0;
        margin: 0 auto;
        bottom: 0px;
    }

`

export const StatContainer = styled.div`
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

export const Stats = styled.div`
    display: flex;
    flex-direction: column;
    margin: -10px;
    width: 200px;

`

export const OptionType = styled.div`
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

export const OrgCard = styled.div`
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
export const AboutCC = styled.div`
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
        
        /* /height: 350px; */
        text-align: center;
        > div{
            flex-direction: column-reverse;
            gap: 10px;
            align-items: center;
            h2{
                font-size: 1.5em;
            }
            img{
                max-width: 15em;
                margin: 0 auto;
            }
        }
        
        h4{
            font-size: 1.2em;
        }
    }
`


export const CC_notFound = styled.div`
    position: relative;
    flex: 1 0 70%;
    height: 290px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    animation: ${fade_in} 0.2s ease-in-out;
    color: #d3d3d3;
    img{
        max-width: 20em;
    }
    > div{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
`
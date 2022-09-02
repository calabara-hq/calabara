import React from "react"
import styled from "styled-components"
import { contest_data } from "../temp-data";
import { ParseBlocks } from "../block-parser";
import { Label } from "../../common/common_styles";
import { labelColorOptions } from "../../common/common_styles";



const ContestContainerWrap = styled.div`
    display: flex;
    flex: 0 0 70%;
    
    flex-direction: column;
    background-color: #1e1e1e;
    border-radius: 10px;
    margin-left: 20px;
    padding: 10px;

`

const ContestContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    padding: 10px 20px;

    transition: visibility 0.2s, max-height 0.3s ease-in-out;


    &:hover {
        cursor: pointer;
        background-color: #1e1e1e;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
        transform: scale(1.01);
        transition-duration: .5s;

    }


`


const ContestTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    > h2{
        color: #d9d9d9;
        margin: 0px 0px 10px;
        
    }

    & ${Label}{
        height:fit-content;
        margin-left: 20px;    
    }

`
const PromptBody = styled.div`
    //max-height: 20ch;
    overflow: hidden;
    //margin: 10px;
    

    > p {
        font-size: 16px;
        color: #d3d3d3;
        text-align: center;
    }
`






let short_prompt = contest_data.prompts[0]
let long_prompt = JSON.parse(JSON.stringify(contest_data.prompts[0]))

long_prompt.blocks =
    [
        {
            "id": "EBiFiTtBfI",
            "type": "paragraph",
            "data": {
                "text": "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
            }
        }
    ]



export default function PromptDisplay() {
    let prompt = long_prompt;
    return (


        <ContestContainerWrap>
            <ContestContainer>
                <PromptBody>
                    <ContestTop>
                        <h2>{prompt.title}</h2>
                        <Label color={labelColorOptions[prompt.label.color]}>{prompt.label.name}</Label>
                    </ContestTop>
                    <ParseBlocks data={prompt} />
                </PromptBody>
            </ContestContainer>

        </ContestContainerWrap>
    )



}
import styled from 'styled-components'
import React from 'react'
import { useHistory } from 'react-router-dom'


const BackButtonDiv = styled.div`

    margin: 20px auto;
    width: ${props => props.customWidth ? props.customWidth : '90%'};
    > span::before{
    font-family: 'Font Awesome 5 Free';
    margin-right: 10px;
    content: "\f060";
    font-weight: 900;
  }

    > span{
    cursor: pointer;
    color: grey;
    font-size: 16px;
  } 

    > span:hover{
    color: #d2d2d2;
  }




`

export default function BackButton({link, text, customWidth}){
    const history = useHistory();
    return(
      <BackButtonDiv customWidth={customWidth}>
        <span onClick={() => {history.push(link)}}>{text}</span>
      </BackButtonDiv>
    )
  }
  


import '../../css/back-button.css'
import React from 'react'
import { useHistory } from 'react-router-dom'

export default function BackButton({link, text}){
    const history = useHistory();
    return(
      <div className="back-button-container">
        <span onClick={() => {history.push(link)}}>{text}</span>
      </div>
    )
  }
  


import '../../css/navbar.css'
import Wallet from '../wallet/wallet'
import calabaraLogo from '../../img/calabara-logo.svg'
import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"


function Nav({homepage}) {
  // button will be different depending on if this is the homepage '/' or not
  const history = useHistory();

  console.log('re rendering nav')

  return (
    <>
    {!homepage && 
    <nav className="navbar">
      <div className="parent-container">
          <div className="navbar-brand">
            <span className="navbar-logo">
              <a onClick={()=>history.push('/explore')}>
                <img src={calabaraLogo} title=""></img>
              </a>
            </span>
        </div>
        <Wallet/>        
        </div>
    </nav>  
    }
    {homepage && 
    <nav className="navbar homepage">
    <div className="parent-container">
        <div className="navbar-brand">
          <span className="navbar-logo">
            <a onClick={()=>history.push('/explore')}>
              <img src={calabaraLogo} title=""></img>
            </a>
          </span>
      </div>
      <div className="landing-page-btns">
      <button className="launchAppBtn" onClick={()=>history.push('/explore')}>Launch App</button>
    </div>      
      </div>
  </nav> 
    
    }
    </>
  );
}

export default Nav;

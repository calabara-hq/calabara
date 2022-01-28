import '../../css/setup.css'
import React, {useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { validAddress } from '../wallet/wallet'


function Setup() {
const [ens, setEns] = useState('')
const [validEns, setValidEns] = useState(0);
const [submit, setSubmit] = useState(0);




const updateInput = (e) =>{
  setEns(e.target.value)
}

useEffect(async()=>{
  // simple check to make sure we don't slow the program down with too many validAddress calls
  if(ens.endsWith('.eth')){
    console.log(ens)
    var valid = await validAddress(ens)
    console.log(valid)
    if(valid == false){
      setValidEns(0);
    }
    else{
    setValidEns(1)
    }
  }
  else{
    setValidEns(0);
  }

},[ens])


const history = useHistory();

const handleClick = async() =>{
  setSubmit(1)
  history.push('/' + ens + '/settings/')
}



  return(
    <div className="input-container">
    <h2> Create a Dashboard </h2>
      <div className="ens-verify">
        <div className="setup-heading">
          <h4> Use an ENS name to create your organization dashboard </h4>
        </div>
        <div className="user-interact">
          <div className="text-input">
            <input placeholder="e.g. calabara.eth" value={ens} onChange={updateInput} type="text"></input>
          </div>
          <div className="dialogue-btn">
            <button disabled={!validEns} className={validEns ? 'ens-button ens-button-purple' : 'ens-button ens-button-grey'} onClick={handleClick}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Setup;

import '../../css/google-cal-integration.css'
import calendarIdImage from '../../img/calendar-id.png'
import shareCalendarImage from '../../img/shareCalendar.png'
import React, {useState, useEffect } from 'react'
import Tooltip from '@mui/material/Tooltip';
import { useParams, useHistory } from 'react-router-dom'
import { validAddress } from '../wallet/wallet'
import axios from 'axios'

function CalendarIntegration() {
const [validEns, setValidEns] = useState(0);
const [inputError, setInputError] = useState(0);
const [calendarID, setCalendarID] = useState('')
const [progress, setProgress] = useState(1)
const [copyStatus, setCopyStatus] = useState('copy to clipboard')
const [statusMessageCode, setStatusMessageCode] = useState(0)
const [isGatekeeperOn, setIsGatekeeperOn] = useState(1)

const { ens } = useParams();

const history = useHistory();

const updateCalendarID = (e) =>{
  if(inputError == 1){
    setInputError(0)
  }
  setCalendarID(e.target.value)
}

async function pushWidget(){
  const params = {endpoint: '/addWidget', data: {ens: ens, name: 'calendar', link: calendarID, widget_logo: 'img/widget-logos/calendar.svg', gatekeeper_enabled: isGatekeeperOn}}
  var req = await axios.post(params.endpoint, params.data)
  setProgress(4)
}




function copyToClipboard(){
  navigator.clipboard.writeText('calabara-service-account@calabara-331416.iam.gserviceaccount.com')
  setCopyStatus('copied!')
  setTimeout(()=>{setCopyStatus('copy to clipboard')}, 1000)
}

// first step in adding the calendar.
// for google calendar, we use a service account to access a calendar instance.
// if the calendar is public, fetchCalendarMetaData will return OK and we can immediately start interfacing with the calendar
// if fetchCalendarMetaData returned FAIL, 1 of 2 things happened...
// either
// 1. the calendar is not public
// 2. user error on calendarID input
// googles calendar api gives the same response in both cases. (pending further analysis)
// in both cases, we'll render a 'Step 2' section which allows the user to add our service account to their calendar.
// if they do this, then fetchCalendarMetaData should now return true.
// if they do this and fetchCalendarMetaData returns FAIL still, then they probably typed it in wrong.



async function submitCalendarID(){
  var result = await axios.post('/fetchCalendarMetaData', {calendarID: calendarID})
  console.log(result)
  if(result.data == 'FAIL'){
    setProgress(2)
  }
  else{
    fadeStatus(1);
    setProgress(3);
  }
}

function fadeStatus(code){
  setStatusMessageCode(code)
  setInputError(1)
  setTimeout(()=>
    setStatusMessageCode(0)
    ,3000)
}

async function testGrantedAccess(){
  var result = await axios.post('/fetchCalendarMetaData', {calendarID: calendarID})
  console.log(result)
  if(result.data == 'FAIL'){
    fadeStatus(-1);
    setProgress(1);
  }
  else{
    fadeStatus(1);
    setProgress(3);
  }
}




  return(

    <div className="calIntegrationContainer">

      {statusMessageCode == -1 &&
      <div className="errorMessage">
      <span>there was a problem... wgmi tho </span>
      </div>
      }
      <div className="intro">
      {progress < 3 && <h2>Integrate a google calendar</h2>}
      </div>
      {progress < 3 &&
      <div className="step1">
      <h3 className="step1Heading">Step 1</h3>
        <div className="step1Info">
        <p>Locate the calendar ID for your organization.</p>
        <p> 1. Open calendar settings and scroll down to the <strong> Integrate calendar </strong> section</p>
        <p> 2. Copy the Calendar ID for your organization and paste it in the box to the right. It should look like this</p>
        <p> ** Note: Chrome browsers have a propensity to copy more than just the calendarID</p>
        <img src={calendarIdImage}></img>
        </div>
        <div className="step1Action">
        <h4> calendar id</h4>
        {inputError == 1 && <p className="step1InputError"> This doesn't seem like a valid calendar ID. </p>}
        <input className={"cal-id-input " + (inputError == 1 ? 'calIdError' : '')} placeholder="xxxxyyyyzzzz@group.calendar.google.com" onChange={updateCalendarID} value={calendarID}/>
        <button className="calendarIdBtn" onClick={submitCalendarID}>Next</button>
        </div>
      </div>
      }


      {progress == 2 &&
        <>
      <div className="step2">
      <h3 className="step2Heading">Step 2</h3>
        <div className="step2Info">
        <p>It seems that your organizations calendar is not public. That's OK. You will just have to give us access.</p>
        <p> 1. Copy our service account address here</p>
        <Tooltip title={<h1>{copyStatus}</h1>} arrow>
        <pre onClick={copyToClipboard}>calabara-service-account@calabara-331416.iam.gserviceaccount.com</pre>
        </Tooltip>
        <p> 2. Open the calendar settings again, and find the section near the top titled <strong>Share with specific people.</strong></p>
        <p> 3. Select <strong>Add people</strong> and paste our account address in the field. Please set the permissions to <strong>See all event details</strong></p>
        <p> 4. Please click verify after you have added our service account to your calendar.</p>
        <p>Your entry should look like this after selecting <strong>send</strong>.</p>
        <img src={shareCalendarImage}></img>
        </div>
        <div className="step2Action">
        <h4> Please click verify after you have added our service account to your calendar.</h4>
        <button className="verifyBtn" onClick={testGrantedAccess}>Verify</button>
        </div>
      </div>
      </>
      }


      {progress == 3 &&

        <div className="calendarGatekeeper">
        <h3>Would you like to enable the gatekeeper?</h3>
        <input checked={isGatekeeperOn} onChange={()=>setIsGatekeeperOn(!isGatekeeperOn)} className="react-switch-checkbox" id={`react-switch-toggle`} type="checkbox"/>
        <label  style={{ background: isGatekeeperOn && '#06D6A0' }} className="react-switch-label" htmlFor={`react-switch-toggle`}>
          <span className={`react-switch-button`} />
        </label>
        <button className="gatekeeprNext" onClick={pushWidget}>Next</button>



        </div>

      }
      {progress == 4 &&

        <div className="integrationComplete">
        <h1>&#127881;&#127881;&#127881;</h1>
        <h3>That was easy. Your calendar is all set up. Click below to head back to the {ens} dashboard.</h3>
        <button className="backToDash" onClick={()=>history.push('/' + ens + '/dashboard')}>Go to dashboard</button>


        </div>

      }



    </div>
  )

}

export default CalendarIntegration;

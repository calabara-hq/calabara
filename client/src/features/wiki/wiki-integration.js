import '../../css/wiki-integration.css'
import fireplace from '../../img/8bitfire.gif'
import React, {useState, useEffect, useRef} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { validAddress } from '../wallet/wallet'
import axios from 'axios'
import DragList from '../drag-n-drop/dragList'
import Glyphicon from '@strongdm/glyphicon'

function WikiIntegration() {
const [statusMessageCode, setStatusMessageCode] = useState(0)
const [isGatekeeperOn, setIsGatekeeperOn] = useState(1)

const { ens } = useParams();

const history = useHistory();


async function pushWidget(){
  const params = {endpoint: '/addWidget', data: {ens: ens, name: 'wiki', link: 1, widget_logo: 'img/widget-logos/wiki.svg', gatekeeper_enabled: isGatekeeperOn}}
  var req = await axios.post(params.endpoint, params.data)
}


  const docs = [];



  return(
    <div className="wiki-integration-container">

    <h1> welcome to the writers lounge </h1>

      <div className="wiki-grid">
        <div className="wiki-ambience">
        <img src={fireplace}/>
        <p> enjoy your stay. We should have enough kindling for your visit. </p>
        </div>
        <div className="new-wiki-container">
        <p> new wiki! </p>
        <button onClick={() => history.push('wiki-edit/new')}>&#128395;</button>
        </div>
      </div>

      <DragList/>


    </div>
  )

}

export default WikiIntegration;

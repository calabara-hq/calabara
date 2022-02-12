import React, {useEffect, useState} from 'react'
import { getSpace, getProposals, didAddressVote, userParticipation, globalParticipation } from '../../helpers/snapshot_api'
import '../../css/analytics.css'
import { useHistory, useParams } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import * as WebWorker from '../../app/worker-client.js'


import {
  setInstalledWidgets,
  setInstallableWidgets,
  populateInitialWidgets,
  selectInstalledWidgets,
  selectInstallableWidgets,
  populateVisibleWidgets,
  selectVisibleWidgets,
  updateWidgets,
  setWidgetNotification,
} from '../dashboard/dashboard-widgets-reducer';

import {
  isMember,
  deleteMembership,
  addMembership,
  selectMemberOf,
  populateInitialMembership,
} from '../org-cards/org-cards-reducer';

import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../wallet/wallet-reducer';



function Analytics() {

  const dispatch = useDispatch();
  const { ens } = useParams();
  const walletAddress = useSelector(selectConnectedAddress)
  const isConnected = useSelector(selectConnectedBool)
  const [dataPulled, setDataPulled] = useState(false)
  const [missedVotes, setMissedVotes] = useState({votes: []})
  const [userParticipationPercentage, setUserParticipationPercentage] = useState(0)
  const [globalParticipationPercentage, setGlobalParticipationPercentage] = useState(0)
  const [pastFiveproposals, setPastFiveProposals] = useState([])


  useEffect(()=>{
    if(!dataPulled && isConnected){
      dispatch(populateInitialMembership(walletAddress))
      setDataPulled(true)
    }
  },[isConnected])


  useEffect(()=>{
    (async() => {
      if(dataPulled){
        WebWorker.processImages();
        const isMemberOf = dispatch(isMember(ens))
          const votes = await didAddressVote(ens, walletAddress);
          console.log(votes)
          setMissedVotes({votes: votes})
          const percentage = await userParticipation(ens, walletAddress)
          setUserParticipationPercentage(percentage)
  
          const past5 = await getProposals(ens, 'closed', 5)
          setPastFiveProposals(past5)
      }

    })();
  },[dataPulled])


  return (
    <div className="analyticsContainer">
    
    <div className="newProposals">
      <h1>Active Proposals</h1>
    {missedVotes.votes.length > 0 &&
    <>
      <h3> These are active proposals you haven't voted on yet.</h3>
      <div className="proposalBox">
      {missedVotes.votes.map((proposal, idx) => {
        return <Proposal proposal={proposal} ens = {ens}/>;
      })}
      </div>
    </>

    }
    {(missedVotes.votes.length === 0  && !isConnected) &&
    <div className="new-proposal-message">
      <h2>Connect your wallet to view active proposals!</h2>
    </div>
    }
    {(missedVotes.votes.length === 0  && isConnected) &&
    <div className="new-proposal-message">
      <h2>You're all caught up! Have a great day 🌅</h2>
    </div>
    }
    </div>
    <div className="snapshot-flex-column-2">
      <div className="myParticipation">
      <DoughnutChart chartData={userParticipationPercentage}/>
      </div>
      <div className="pastProposals">
        <h1>Past proposals</h1>
        <div className="proposalBox">
          {pastFiveproposals.map((proposal)=>{
          return <Proposal proposal={proposal} ens = {ens}/>;
          })}
        </div>
      </div>
    </div>
    </div>

  );
}

function Proposal({proposal, ens}){

  var endDate = new Date(proposal.end * 1000)
  endDate = endDate.toString();



  return(
    <>
    <div className={'proposal ' + (proposal.state === 'active' ? 'active' : 'closed')} onClick={()=> window.open(('https://snapshot.org/#/' + ens + '/proposal/' + proposal.id).toLowerCase())}>
    <h4>{proposal.title} </h4>
    <div className={'proposal-status-btn ' + (proposal.state === 'active' ? 'active' : 'closed')}>{proposal.state}</div>
    </div>
    </>

  )
}

function DoughnutChart({chartData}){
  console.log(chartData)

  const data = {
    labels: ['% voted', '% did not vote'],
    datasets: [
      {
        label: '# of Votes',
        data: [chartData, 100-chartData],
        backgroundColor: [
          '#339966',
          '#ff9999',
        ],
        borderColor: [
          'black',
          'black',
        ],
        borderWidth: 4,
      },
    ],
  };

  const options =  {
    plugins: {
      legend: {
        labels: {
          color: '#F9F6EE',
          font: {
            size: 16,
          }
        }
      }
    }
  }






  return(
  <>
  <div className='header'>
      <h1 className='doughnut-title'>My participation</h1>
      <div className='links'>
      </div>
    </div>
    <div className="chartContainer">
    <Doughnut data={data} options={options} />
    </div>
  </>
 )
}

export default Analytics;

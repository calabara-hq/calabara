import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { listEvents } from '../../helpers/google-calendar'
import { useHistory, useParams } from "react-router-dom"
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";


import '../../css/calendar.css'
import "react-big-calendar/lib/css/react-big-calendar.css";


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


export default function Events(){
  const { ens, calendarId } = useParams();
  const dispatch = useDispatch();
  const isConnected = useSelector(selectConnectedBool)
  const walletAddress = useSelector(selectConnectedAddress)
  const [calendarEvents, setCalendarEvents] = useState([])
  const [dataPulled, setDataPulled] = useState(false)



  useEffect(async()=>{
    if(dataPulled == false && isConnected == true){
     await dispatch(populateInitialMembership(walletAddress))
     setDataPulled(true)
    }
  },[isConnected])


  useEffect(async()=>{


    if(dataPulled){
        var result = await listEvents(calendarId);
        var events = result.data.data.items;


        /* we want our data like this

            
              events: [
                {
                  start: moment().toDate(),
                  end: moment()
                    .add(1, "hours")
                    .toDate(),
                  title: "Some title"
                }
              ]


        */

        events.map((eventItem, idx) => {
          eventItem.start = moment(eventItem.start.dateTime).toDate();
          eventItem.end = moment(eventItem.end.dateTime).toDate();
          eventItem.title = eventItem.summary;
          eventItem.timeUntil = moment.duration(moment(eventItem.start).diff(moment()))
        })

        console.log(events)
        setCalendarEvents(events)
    }
  },[dataPulled])

  const localizer = momentLocalizer(moment);


  return(

  <div className="calendarContainer">

    <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={calendarEvents}
          style={{ height: "100vh" }}
        />

  </div>
  )
}


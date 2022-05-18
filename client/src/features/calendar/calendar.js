import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { listEvents } from '../../helpers/google-calendar'
import { useHistory, useParams } from "react-router-dom"
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CalendarModal from './calendar-modal.js';
import BackButton from '../back-button/back-button';
import axios from 'axios'


import '../../css/calendar.css'
import "react-big-calendar/lib/css/react-big-calendar.css";


export default function Events() {
  const { ens, calendarId } = useParams();
  const [calendarEvents, setCalendarEvents] = useState([])
  const [dataPulled, setDataPulled] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [eventData, setEventData] = useState('')

  const open = () => { setModalOpen(true) }
  const close = () => { setModalOpen(false) }

alert('look here')

  useEffect(() => {
    if (dataPulled == false) {
      setDataPulled(true)
    }
  }, [])


  useEffect(() => {

    (async () => {

      if (dataPulled) {
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

        setCalendarEvents(events)
      }
    })();
  }, [dataPulled])

  const localizer = momentLocalizer(moment);



  return (
    <>
    <BackButton link={'/' + ens + '/dashboard'} text={"back to dashboard"}/>

      <div className="calendarContainer">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={calendarEvents}
          style={{ height: "100vh" }}
          onSelectEvent={(e) => { setModalOpen(true); setEventData(e) }}
        />
      </div>
      <div>
        {modalOpen && <CalendarModal modalOpen={modalOpen} handleClose={close} eventData={eventData}/>}
      </div>

    </>
  )

}


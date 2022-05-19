import React, { useEffect, useState } from 'react'
import { listEvents } from '../../helpers/google-calendar'
import { useParams } from "react-router-dom"
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CalendarModal from './calendar-modal.js';
import BackButton from '../back-button/back-button';


import '../../css/calendar.css'
import "react-big-calendar/lib/css/react-big-calendar.css";


export default function Events() {
  const { ens, calendarId } = useParams();
  const [calendarEvents, setCalendarEvents] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [eventData, setEventData] = useState('')

  const open = () => { setModalOpen(true) }
  const close = () => { setModalOpen(false) }


  useEffect(() => {

    (async () => {

      var result = await listEvents(calendarId);
      var events = result.data.data.items;

      events.map((eventItem, idx) => {
        eventItem.start = moment(eventItem.start.dateTime).toDate();
        eventItem.end = moment(eventItem.end.dateTime).toDate();
        eventItem.title = eventItem.summary;
        eventItem.timeUntil = moment.duration(moment(eventItem.start).diff(moment()))
      })

      setCalendarEvents(events)
    })();
  }, [])

  const localizer = momentLocalizer(moment);



  return (
    <>
      <BackButton link={'/' + ens + '/dashboard'} text={"back to dashboard"} />

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
        {modalOpen && <CalendarModal modalOpen={modalOpen} handleClose={close} eventData={eventData} />}
      </div>

    </>
  )

}


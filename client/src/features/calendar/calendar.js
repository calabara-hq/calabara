import React, { useEffect, useState } from 'react'
import { listEvents } from '../../helpers/google-calendar'
import { useParams } from "react-router-dom"
import Kalend, { CalendarView, OnNewEventClickData } from 'kalenda' // import component
import 'kalenda/dist/styles/index.css'; // import styles
import moment from "moment";
import CalendarModal from './calendar-modal.js';
import BackButton from '../back-button/back-button';


import '../../css/calendar.css'

const colors = [
  'indigo',
  'blue',
  'orange',
  'red',
  'pink',
  'crimson',
  'dodgerblue',
  'brown',
  'purple',
  'tomato',
  'MediumPurple',
  'salmon',
];

export default function Events() {
  const { ens, calendarId } = useParams();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const open = () => { setModalOpen(true) }
  const close = () => { setModalOpen(false) }


  useEffect(() => {

    (async () => {

      var result = await listEvents(calendarId);
      var events = result.data.data.items;
      console.log(events)

      events.map((eventItem, idx) => {
        eventItem.id = idx;
        eventItem.startAt = moment(eventItem.start.dateTime).toISOString();
        eventItem.endAt = moment(eventItem.end.dateTime).toISOString();
        eventItem.timeUntil = moment.duration(moment(eventItem.start).diff(moment()))
        eventItem.color = colors[Math.floor(Math.random() * colors.length - 1) + 1];
      })
      setCurrentDate(new Date().toISOString())
      setCalendarEvents(events)
    })();
  }, [])



  const onSelectView = (view) => {
    console.log(view)
    setCurrentDate(new Date().toISOString())
  }

  const onEventClick = (data) => {
    console.log(data)
    setEventData({
      start: moment(data.startAt).toDate(),
      end: moment(data.endAt).toDate(),
      htmlLink: data.htmlLink,
      title: data.summary,
      description: data.description
    })
    setModalOpen(true)
  }
  return (
    <>
      <BackButton link={'/' + ens + '/dashboard'} text={"back to dashboard"} />

      <div className="calendarContainer">
        <Kalend
          disabledDragging={true}
          autoScroll={true}
          showTimeLine={true}
          onPageChange={onSelectView}
          events={calendarEvents}
          onEventClick={onEventClick}
          initialDate={currentDate}
          hourHeight={60}
          initialView={CalendarView.WEEK}
          timeFormat={'12'}
          weekDayStart={'Monday'}
          language={'en'}
          
        />
      </div>
      <div>
        {modalOpen && <CalendarModal modalOpen={modalOpen} handleClose={close} eventData={eventData} />}
      </div>

    </>
  )

}
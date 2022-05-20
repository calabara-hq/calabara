import React, { useEffect, useState } from 'react'
import { listEvents } from '../../helpers/google-calendar'
import { useParams } from "react-router-dom"
import { Calendar, momentLocalizer } from "react-big-calendar";
import Kalend, { CalendarView, OnNewEventClickData, OnSelectViewData } from 'kalenda' // import component
import 'kalend/dist/styles/index.css'; // import styles
import moment from "moment";
import CalendarModal from './calendar-modal.js';
import BackButton from '../back-button/back-button';


import '../../css/calendar.css'
import "react-big-calendar/lib/css/react-big-calendar.css";

function Events() {
  const { ens, calendarId } = useParams();
  const [calendarEvents, setCalendarEvents] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [eventData, setEventData] = useState('')
  const [currentDate, setCurrentDate] = useState('')

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
      setCurrentDate(new Date().toISOString())
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

export default function Events2() {
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
        eventItem.color = 'blue';
      })
      setCurrentDate(new Date().toISOString())
      setCalendarEvents(events)
    })();
  }, [])


  const localizer = momentLocalizer(moment);

  const onSelectView = (view) => {
    console.log(view)
    setCurrentDate(new Date().toISOString())
  }

  const onNewEventClick = (data) => {
    console.log(data);

    const msg = `New event click action\n\n Callback data:\n\n${JSON.stringify({
      hour: data.hour,
      day: data.day,
      startAt: data.startAt,
      endAt: data.endAt,
      view: data.view,
      event: 'click event ',
    })}`;
    console.log(msg);
  };

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
          onEventClick={(e) => { setModalOpen(true); setEventData(e) }}
          initialDate={currentDate}
          hourHeight={60}
          initialView={CalendarView.WEEK}
          disabledViews={[CalendarView.DAY]}
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
import axios from 'axios'
import React from 'react'

// get 11:59 pm 2 days from now
Date.prototype.calcEnd = function() {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + 2)
    return date;
}



async function listEvents(calendarID, maxResults){
  const startTime = new Date();
  
  const endTime = startTime.calcEnd()
  

  var result = await axios.post('/fetchCalendarEvents', {calendarID: calendarID, startTime: startTime, endTime: endTime})

  
  return result
}

export {listEvents}

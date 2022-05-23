import axios from 'axios'

// get 2 months before 
Date.prototype.calcEnd = function() {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + 2)
    return date;
}

// get 2 months after 
Date.prototype.calcStart = function() {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() - 2)
  return date;
}


async function listEvents(calendarID, maxResults){
  const currentTime = new Date();
  
  const endTime = currentTime.calcEnd()
  const startTime = currentTime.calcStart()

  var result = await axios.post('/dashboard/fetchCalendarEvents', {calendarID: calendarID, startTime: startTime, endTime: endTime})

  
  return result
}

export {listEvents}

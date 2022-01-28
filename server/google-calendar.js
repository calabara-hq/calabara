var {google} = require('googleapis');

const dotenv = require('dotenv');
dotenv.config();
const SCOPES = 'https://www.googleapis.com/auth/calendar';

var auth = new google.auth.JWT(
    process.env.GOOGLE_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    SCOPES,
);



const api = google.calendar({version : "v3", auth : auth});

//Returns metadata for a calendar.
async function fetchCalendarMetaData(calendarId){
  try{
    var resp = await api.calendars.get({calendarId : calendarId})
    return 'OK'
  }catch(err){
    return 'FAIL'
  }

}


// Make an authorized request to list Calendar events.

async function listEvents(calendarId, startTime, endTime){
  console.log(startTime, endTime)
  try{
    const resp = api.events.list({
        calendarId: calendarId,
        timeMax: endTime,
        timeMin: startTime,
        singleEvents: true,
      });
      return resp;
    }catch(e){
      return('FAIL')
    }
  }

//export {fetchCalendarMetaData}
exports.fetchCalendarMetaData = fetchCalendarMetaData;
exports.listEvents = listEvents;

import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../../css/container.css'
import Cards from '../org-cards/org-cards'
import Dashboard from '../dashboard/dashboard'
import Setup from '../setup/setup'
import Analytics from '../analytics/analytics'
import CalendarIntegration from '../calendar-integration/google-cal-integration'
import WikiIntegration from '../wiki/wiki-integration'
import WikiDisplay from '../wiki/wiki-display'
import Events from '../calendar/calendar'
import ReactEditor from '../wiki/wiki-edit'
import Notfound from '../notfound/notfound'
import Settings from '../settings/settings'



export default function Container(){



  return(
    <div className='container'>

{/*
    <Route path="/*">
    <Notfound/>
    </Route>
*/}
    <Route path="/:ens/dashboard">
    <Dashboard/>
    </Route>

    <Route path="/explore">
    <Cards/>
    </Route>

    <Route path="/setup">
    <Setup/>
    </Route>

    <Route path="/:ens/snapshot">
    <Analytics/>
    </Route>

    <Route path="/:ens/calendar/:calendarId">
    <Events/>
    </Route>


    <Route path="/:ens/wiki">
    <WikiDisplay/>
    </Route>


    <Route path="/:ens/wiki-edit/:grouping/:file">
    <ReactEditor/>
    </Route>

    </div>
  )
}

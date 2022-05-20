import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import '../../css/container.css'
import Cards from '../org-cards/org-cards'
import Dashboard from '../dashboard/dashboard'
import Analytics from '../snapshot-analytics/snapshot-analytics'
import WikiDisplay from '../wiki/wiki-display'
import Events from '../calendar/calendar'
import ReactEditor from '../wiki/wiki-edit'
import SettingsManager from '../settings/settings'
import ManageWidgets from '../manage-widgets/manage-widgets'
export default function Container() {



  return (
    <div className='application-container'>

      <Route path="/:ens/dashboard">
        <Dashboard />
      </Route>


      <Route path="/explore">
        <Cards />
      </Route>


      <Route path="/:ens/snapshot">
        <Analytics />
      </Route>

      <Route path="/:ens/calendar/:calendarId">
        <Events />
      </Route>


      <Route path="/:ens/docs/">
        <WikiDisplay />
      </Route>

      <Route path="/:ens/settings">
        <SettingsManager />
      </Route>

      <Route path="/:ens/manageWidgets">
        <ManageWidgets />
      </Route>

      <Route path="/:ens/docs-edit/:grouping/:file">
        <ReactEditor />
      </Route>

    </div>
  )
}

import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from 'react-router-dom'
import '../../css/container.css'
import Nav from '../navbar/navbar'
import Cards from '../org-cards/org-cards'
import Dashboard from '../dashboard/dashboard'
import Analytics from '../snapshot-analytics/snapshot-analytics'
import WikiDisplay from '../wiki/wiki-display'
import Events from '../calendar/calendar'
import ReactEditor from '../wiki/wiki-edit'
import SettingsManager from '../settings/settings'
import ManageWidgets from '../manage-widgets/manage-widgets'
import ContestSettings from '../creator-contests/components/contest_settings/contest-settings'
import Homepage from '../homepage/homepage'
import ContestInterface from '../creator-contests/components/contest-live-interface/interface'


export default function Container() {

  const location = useLocation();

  const homepage = location.pathname === '/'

  return (
    <div className='application-container'>

      <Nav homepage={homepage} />

      <Route exact path="/">
        <Homepage />
      </Route>

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

      <Route path="/:ens/contest_settings">
        <ContestSettings />
      </Route>

      <Route path="/:ens/creator_contests">
        <ContestInterface />
      </Route>
    </div>
  )
}

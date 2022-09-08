import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from 'react-router-dom'
import '../../css/container.css'
import { HomepageNav, ApplicationNav } from '../navbar/navbar'
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
import ContestInterfaceController from '../creator-contests/components/contest-live-interface/interface/contest-interface-ctr'
import ContestHomepage from '../creator-contests/components/contest-home/contest-home'
import { WalletProvider } from '../../app/WalletContext'


export default function Container() {



  const location = useLocation();

  const homepage = location.pathname === '/'

  return (
    <div className='application-container'>
      <Switch>
        <Route exact path="/">
          <HomepageNav />
          <Homepage />
        </Route>

        <Route path="/*">
          <Application />
        </Route>
      </Switch>
    </div>


  )
}




function Application({ }) {
  return (
    <WalletProvider>


      <ApplicationNav />

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

      <Route exact path="/:ens/creator_contests">
        <ContestHomepage />
      </Route>


      <Route exact path="/:ens/creator_contests/:contest_hash">
        <ContestInterfaceController />
      </Route>

    </WalletProvider>

  )
}
import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from 'react-router-dom'
import '../../css/container.css'
import { HomepageNav, ApplicationNav } from '../navbar/navbar'
import Homepage from '../homepage/homepage'
import { WalletProvider } from '../../app/WalletContext'
import LazyLoader from '../lazy-loader/lazy-loader'
const Cards = lazy(() => import('../org-cards/org-cards'))
const Dashboard = lazy(() => import('../dashboard/dashboard'))
const Analytics = lazy(() => import('../snapshot-analytics/snapshot-analytics'))
const WikiDisplay = lazy(() => import('../wiki/wiki-display'))
const Events = lazy(() => import('../calendar/calendar'))
const ReactEditor = lazy(() => import('../wiki/wiki-edit'))
const SettingsManager = lazy(() => import('../settings/settings'))
const ManageWidgets = lazy(() => import('../manage-widgets/manage-widgets'))
const ContestSettings = lazy(() => import('../creator-contests/components/contest_settings/contest-settings'))
const ContestHomepage = lazy(() => import('../creator-contests/components/contest-home/contest-home'))
const ContestInterfaceController = lazy(() => import('../creator-contests/components/contest-live-interface/interface/contest-interface-ctr'))


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
          <Suspense fallback={<LazyLoader />}>
            <Application />
          </Suspense>
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
        <Suspense>
          <Dashboard />
        </Suspense>
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
import { Suspense, lazy, useEffect } from 'react'
import { Switch, Route, Link, useLocation } from 'react-router-dom'
import { HomepageNav, ApplicationNav } from '../navbar/navbar.js'
import Homepage from '../homepage/homepage.js'
import { WalletProvider } from '../../app/WalletContext.js'
import LazyLoader from '../lazy-loader/lazy-loader.js'
import Test from './test'
import { clearSession } from '../../app/sessionReducer'
import { useDispatch } from 'react-redux'
const Cards = lazy(() => import('../org-cards/org-cards.js'))
const Dashboard = lazy(() => import('../dashboard/dashboard.js'))
const Analytics = lazy(() => import('../snapshot-analytics/snapshot-analytics.js'))
const WikiDisplay = lazy(() => import('../wiki/wiki-display.js'))
const Events = lazy(() => import('../calendar/calendar.js'))
const ReactEditor = lazy(() => import('../wiki/wiki-edit.js'))
const SettingsManager = lazy(() => import('../settings/settings.js'))
const ManageWidgets = lazy(() => import('../manage-widgets/manage-widgets.js'))
const ContestSettings = lazy(() => import('../creator-contests/components/contest_settings/contest-settings.js'))
const ContestHomepage = lazy(() => import('../creator-contests/components/contest-home/contest-home.js'))
const ContestInterfaceController = lazy(() => import('../creator-contests/components/contest-live-interface/interface/contest-interface-ctr.js'))


export default function Routes({ initial_session }) {
  const dispatch = useDispatch();
  const fetchWithSessionCheck = () => {
    fetch('/authentication/isAuthenticated', { credentials: 'include' })
      .then(res => res.json())
      .then(res => {
        if (!res.authenticated) dispatch(clearSession())
      })
      .catch(err => false)
  }


  const location = useLocation();

  const homepage = location.pathname === '/'

  useEffect(() => {
    fetchWithSessionCheck()
  }, [location])

  return (
    <div className='application-container'>
      <Switch>
        <Route exact path="/">
          <HomepageNav />
          <Homepage />
        </Route>

        <Route path="/*">
          <Suspense fallback={<LazyLoader />}>
            <ApplicationRoutes initial_session={initial_session} />
          </Suspense>
        </Route>
      </Switch>
    </div>
  )
}




function ApplicationRoutes({ initial_session }) {
  return (

    <WalletProvider initial_session={initial_session}>

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
      <Route path="/:ens/test_path">
        <Test />
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
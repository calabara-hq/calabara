import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DiscordRedirect from '../features/discord/discord-oauth-redirect.js';
import wrapPromise from '../helpers/wrap-promise';
import Routes from '../routes/routes.js';
import { disconnectSocket, initializeSocketConnection, socket } from "../service/socket.js";
import { clearSession, setUserSession } from './sessionReducer.js';

const fetchSession = () => {
  const promise = fetch('/authentication/isAuthenticated', { credentials: 'include' })
    .then(res => res.json())
    .then(res => res.authenticated ? res.user : false)
    .catch(err => false)
  return wrapPromise(promise)
}

const resource = fetchSession()

export default function App() {
  const dispatch = useDispatch()
  const session = resource.read()


  useEffect(() => {
    dispatch(setUserSession(session))
    // start socket as early as possible
    initializeSocketConnection();
    socket.on('connect', () => {
      console.log('connected to socket')
    })
    return () => {
      disconnectSocket();
      dispatch(clearSession())
    }
  }, [])

  return (

    <Router>
      <Switch>
        <Route path="/oauth/discord">
          <DiscordRedirect />
        </Route>
        <Route path="/*">
          <Routes initial_session={session} />
        </Route>

      </Switch>
    </Router>

  )
}

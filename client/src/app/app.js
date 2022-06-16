import React from 'react';
import Nav from '../features/navbar/navbar';
import Container from '../features/container/container'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import SuccessfulDiscordRedirect from '../features/discord/discord-oauth-redirect'
import Homepage from '../features/homepage/homepage';


export default function App() {


  return (

    <Router>
      <Switch>
        <Route path="/oauth/discord">
          <SuccessfulDiscordRedirect />
        </Route>

        <Route path="/*">
          <Container />
        </Route>

      </Switch>
    </Router>

  )
}

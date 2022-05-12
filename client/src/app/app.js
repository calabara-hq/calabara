import React from 'react';
import Nav from '../features/navbar/navbar';
import Container from '../features/container/container'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Homepage from '../features/homepage/homepage'
import WikiDisplay from '../features/wiki/wiki-display'
import SuccessfulDiscordRedirect from '../features/discord/discord-oauth-redirect'


export default function App() {
  return (

    <Router>
      <Switch>
        <Route exact path="/">
          <Nav homepage={true} />
          <Homepage />
        </Route>

        <Route path="/oauth/discord">
          <SuccessfulDiscordRedirect />
        </Route>

        <Route path="/*">
          <Nav homepage={false} />
          <Container />
        </Route>

      </Switch>
    </Router>

  )
}

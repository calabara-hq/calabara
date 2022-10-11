import React from 'react';
import Container from '../features/container/container.js'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import DiscordRedirect from '../features/discord/discord-oauth-redirect.js'
import TwitterRedirect from '../features/creator-contests/components/contest_settings/twitter_automation/twitter_oauth_redirect.js';


export default function App() {


  return (

    <Router>
      <Switch>
        <Route path="/oauth/discord">
          <DiscordRedirect />
        </Route>
        

        <Route path="/*">
          <Container />
        </Route>

      </Switch>
    </Router>

  )
}

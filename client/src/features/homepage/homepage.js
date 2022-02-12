import logo_sketch from '../../img/calabara-sketch.png'
import docs_logo from '../../img/wiki.svg';
import snapshot_logo from '../../img/snapshot.svg';
import calendar_logo from '../../img/calendar.svg';
import gatekeeper_img from '../../img/gatekeeper.png';
import dashboard_img from '../../img/dashboard.png';
import calendar_img from '../../img/calendar.png';
import docs_img from '../../img/docs.png';
import snapshot_img from '../../img/snapshot.png';
import React, { useState, useEffect } from 'react'


function Homepage() {
  require('../../css/homepage.css')
  const [selectedWidget, setSelectedWidget] = useState('snapshot')

  return (
    <div classNameName="homepageContainer">
      <section className="section1">
        <div className="left">
          <div>
            <div className="section1-header">
              <h1>Web3 coordination tools for digital communities.</h1>
            </div>
            <div className="section1-blueprint">
              <div className="blueprint-row1">
                <p>Calabara</p>
              </div>
              <div className="blueprint-row2">
                <div>
                  <p>Title</p>
                </div>
                <p>Blueprint</p>
              </div>
              <div className="blueprint-row3">
                <p>Document Number</p>
                <p>00-0001 Rev. A</p>
                <p>xxxxx</p>

              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <img className="bigimg" src={logo_sketch} alt="didn't work" />
        </div>

      </section>

      <section className="section2">
        <div className="top">
          <div className="left">
            <img src={dashboard_img} />
          </div>
          <div className="right">
            <h1>Community Dashboards</h1>
            <div>
              <p>Create dashboards for your favorite organizations. Dashboards can be populated with applications that help fellow members keep up with the latest calendar events, snapshot votes, and community documents.</p>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="left">
            <h1>Token Gating</h1>
            <div>
              <p>Give potential frens the pitch. Give OG's the alpha. Use gatekeeper rules to enforce ERC-721 & ERC-20 token balance checks specific to each application.</p>
            </div>
          </div>

          <div className="right">
            <img src={gatekeeper_img} />
          </div>

        </div>
      </section>

      <section className="section3">
        <div className="left">
          <div className="top">
            <h1>V1 🎉</h1>
            <p>V1 is our communities first release. Click through the supported applications below to learn more about them.</p>
          </div>
          <div className="bottom">
            <div className="widgets-container">
              <article onClick={() => { setSelectedWidget('snapshot') }} className={"homepage-widget-card " + (selectedWidget == 'snapshot' ? 'selected' : undefined)} >
                <div className="homepage-card-image">
                  <img src={snapshot_logo} />
                </div>
              </article>
              <article onClick={() => { setSelectedWidget('calendar') }} className={"homepage-widget-card " + (selectedWidget == 'calendar' ? 'selected' : undefined)} >
                <div className="homepage-card-image">
                  <img src={calendar_logo} />
                </div>
              </article>
              <article onClick={() => { setSelectedWidget('docs') }} className={"homepage-widget-card " + (selectedWidget == 'docs' ? 'selected' : undefined)} >
                <div className="homepage-card-image">
                  <img src={docs_logo} />
                </div>
              </article>

            </div>
            <div className="widget-description">
              <h1>{selectedWidget}</h1>
              {selectedWidget == 'snapshot' && <p>The snapshot app provides a useful display of proposals, personalized for the connected wallet. Members can quickly see ongoing proposals which they haven't voted on yet, as well as data about their participation and past proposals.</p>}
              {selectedWidget == 'calendar' && <p>Calendar offers a simple event interface that hooks into google calendar events for community wide calendars. Members can view upcoming events all in one spot.</p>}
              {selectedWidget == 'docs' && <p>Docs allows dashboard admins to create token gated folders and documents. Token checks can be used to provide member wallets with written updates and newbie wallets with the community basics.</p>}
            </div>
          </div>
        </div>
        <div className="right">
          <div className="widget-img">
            {selectedWidget == 'snapshot' && <img src={snapshot_img} />}
            {selectedWidget == 'calendar' && <img src={calendar_img} />}
            {selectedWidget == 'docs' && <img src={docs_img} />}

          </div>
        </div>

      </section>

      <section className="section4">
        <div className="top">
          <div>
            <h1>Roadmap</h1>
            <Squiggle />
          </div>
        </div>
        <div className="bottom">
          <div>
            <p>Establish initial core team of contributors and build V1</p>
          </div>
          <div>
            <p>Release V1. Read/write access for select pilot communities. Read only for public</p>
          </div>
          <div style={{ border: '2px solid #A998FF' }}>
            <p>Rapid development cycle. Iterate, improve, and build on top of V1</p>
          </div>
          <div>
            <p>Public launch</p>
          </div>

        </div>
      </section>


    </div>
  )

}


function Squiggle() {
  return (
    <svg version="1.1" width="98px" height="105.4px" viewBox="-10 -10 110 110">
      <defs>
      </defs>
      <g>
        <g>
          <path d="M49.9,4.1c-11.6-6-19.2,8.4-23,17.2c-3,6.8-5.3,13.9-7.5,21c-2.5,8-5,17.1-0.6,25c3.6,6.5,10.9,10,18.1,7.3
          c7.6-2.8,12.7-10.3,16.9-16.9c4.4-7,8.5-14.4,11.4-22.1c1.2-3.2,3.9-9.9,0.4-12.6c-4-3.1-8.7,2.7-10.8,5.4
          c-4.8,6.1-9.1,13.3-12.8,20.1c-3.6,6.9-5.3,16,2,21.2c5.8,4.1,12.1,0.3,14.8-5.5c6.2-13.7-6-29.1-20.7-25.7
          c-6.8,1.6-12.7,6.7-14.1,13.7c-1.3,6.5,1.3,14.1,7.9,16.6c5.8,2.2,13-0.1,15.3-6.1c2.9-7.7-2.4-17.6-6.2-24.1
          c-4.7-7.9-11.3-15-19-20C16,14.9,7,12.7,2.1,19.1C-2.7,25.4,1.6,34,6.8,38.5C14,44.8,24.4,47.3,33.6,49c5.1,1,10.2,1.6,15.3,1.9
          c6.1,0.4,13-0.7,18.8,1.5c7.8,2.9,9.5,10.9,2.9,16.2c-4.3,3.5-10.2,5.7-15.7,6.6c-6.3,1-13.6-0.4-17.4-5.9
          c-4.2-6.2-2.3-14,1.3-19.9c4.5-7.3,14.7-13.6,14-23.3c-0.6-7.6-8-12-14.1-15.1c-4.5-2.3-9.1-4.4-13.8-6.3C20.1,2.8,14.4,0.2,9.2,0
          C0.8-0.3-0.5,7.8,1.3,14.4c2.6,9.4,10.1,17,17.3,23.1c7.5,6.3,15.9,11.5,24.9,15.3c9.4,4,21.1,5.1,23.4,16.9
          c0.7,3.7,0.7,8.7-2.4,11.4c-2.6,2.3-4.6,1-6-1.8c-3-6.3-2-14.7-0.3-21.2c1.1-4.3,2.9-8.4,5.2-12.2c2.1-3.6,5.1-6.4,7.5-9.8
          c1.4-2.1,3-5,0.8-7.1c-2-1.9-5.9-1.4-8.3-1.2c-4.4,0.4-8.8,1.3-13.3,1.9c-1.5,0.2-8.5,1.7-9.5-0.1c-1-1.7,3.7-7,4.7-8.2
          c2.1-2.6,4.7-4.8,6.7-7.5C55,10,54.1,6.7,49.9,4.1c-1.7-1-3.2,1.6-1.5,2.6c3.3,2,2.6,3.8,0.3,6.5c-2.1,2.4-4.4,4.6-6.4,7.1
          c-1.8,2.3-5.6,6.7-4.7,10c1.3,4.8,9.9,2.8,13.2,2.3c3.7-0.5,7.4-1.2,11.2-1.7c1.3-0.1,6.7-1.2,7.6,0.3c1.3,2-5.4,8.2-6.4,9.5
          c-4,5.5-6.9,11.8-8.4,18.5c-1.5,6.9-3,20.2,3.8,25.1c2.5,1.8,5.4,1.1,7.6-0.8C70,80.4,70.6,75,70,70.5c-0.7-5-3-10.1-7.2-13.1
          c-2.7-1.9-5.9-2.9-9.1-4c-4.8-1.6-9.5-3.4-14.1-5.6c-8-4-15.4-9.1-22-15.1C11.3,26.8,3.1,18.2,3.5,8.8c0.3-8.3,10.5-4.9,15.5-3.2
          c5.4,1.9,10.6,4.2,15.7,6.7c7.7,3.7,19,9.6,13.7,19.9c-3.7,7.3-11,11.9-14.3,19.5C31.4,57.9,31,65.3,34.9,71
          c8.3,12.1,27.8,7.8,37.5,0c4.1-3.3,7-8.4,4.9-13.7c-2.6-6.4-9.6-8.6-15.9-9c-10.1-0.7-19.8-0.5-29.8-2.7
          c-8.7-1.9-18.9-4.4-25-11.4c-3.9-4.6-5.9-13.4,1.6-15.7c5-1.6,10,1.3,14,4.1c7.1,5.1,13,12,17.2,19.6C43,48.7,50.3,66,37,66.6
          C24.8,67.2,24.2,51,31.7,44.8c6.5-5.4,17-5.2,22.2,1.8c2.3,3.1,3.5,7,3.3,10.8c-0.2,4.7-3.4,12.3-9.5,11c-7.7-1.8-6.5-11.7-4-16.8
          c1.6-3.4,3.7-6.5,5.6-9.6c3.1-5.1,6.4-12.5,11.6-15.8c6.3-4.1,0.6,10.3-0.3,12.2c-2.9,6.6-6.5,12.9-10.3,18.9
          C46,63.9,38.9,74.1,29.6,72.3c-12.1-2.4-11-17.4-8.3-26.3c3.5-11.5,6.9-24.2,14-34c3.1-4.4,7.6-8,13-5.2C50.1,7.6,51.6,5,49.9,4.1
          z"/>
        </g>
      </g>
    </svg>
  )
}


export default Homepage;

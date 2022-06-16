import logo_sketch from '../../img/calabara-sketch.png'
import docs_logo from '../../img/wiki.svg';
import snapshot_logo from '../../img/snapshot.svg';
import calendar_logo from '../../img/calendar.svg';
import contest_logo from '../../img/creator-contest.png'
import gatekeeper_img from '../../img/gatekeeper-toggle.png';
import blueprint_img from '../../img/blueprint.png'
import inTheLab from '../../img/contest-mockup.png'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVial, faBook } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import '../../css/stars.scss'


const float = keyframes`
	from { transform: translate(0,  0px); }
  65%  { transform: translate(0, 25px); }
  to   { transform: translate(0, 0px); } 
  `

const Left = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > * {
      margin-bottom: 30px;
    }
`
const Right = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * {
      margin-bottom: 30px;
    }
`

const Top = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 95%;
  margin: 0 auto;

  > * {
      margin-bottom: 30px;
    }

  @media (max-width: 1000px){
    flex-direction: column-reverse;
    margin-bottom: 40px;
  }
`
const Bottom = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 95%;
  margin: 0 auto;

  > * {
      margin-bottom: 30px;
    }

  @media (max-width: 1000px){
    flex-direction: column;
  }
`

const HomePageWrap = styled.div`
  font-family: 'Ubuntu', sans-sans-serif;
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
  margin: 0 auto;
`


function Homepage() {

  return (
    <HomePageWrap>
      <Section1 />
      <Section2 />
      <Section3 />
      <Footer />
    </HomePageWrap>
  )

}


function Section1() {

  const Section1Wrap = styled.section`
    height: 100vh;
    background-color: #141416;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
  `
  const Section1Text = styled.div`
    text-align: left;
    font-size: 3em;
    color: #e2e2e2;
    margin: 0 auto;
    width: 15ch;
    padding: 5px;
    background-color: #141416;

    @media (max-width: 850px) {
      text-align: center;
    }
  `
  const Section1Img = styled.img`
    max-width: 90%;
    min-width: 28em;
  `

  return (
    <div className="stars">
      <div className="small"></div>
      <div className="medium"></div>
      <div className="big"></div>

      <Section1Wrap>
        <Left>
          <div>
            <Section1Text>
              <h1 style={{ color: "rgb(169, 152, 255)" }}>The community-led design house for web3 public goods.</h1>
            </Section1Text>
          </div>
        </Left>
        <Right>
          <Section1Img src={logo_sketch} />
        </Right>
      </Section1Wrap>
    </div>
  )
}

function Section2() {

  const Section2Wrap = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
    text-align: center;
    
  `
  const FloatingApps = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height: 30vh;
    justify-content: center;
    align-items: center;
    grid-gap: 20px;
    justify-self: flex-end;

    @media (min-width: 1000px) and (max-width: 1300px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 740px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
    }

  `
  const AppContainer = styled.div`
    background-color: #22272e;
    padding: 10px;
    height: 12rem;
    max-width: 16rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    animation: ${float} 3s ease-in-out infinite;
    animation-delay: ${props => props.delay}s;
  `

  const Section2Text = styled.div`
    color: #d3d3d3;
    width: 90%;
    font-size: 20px;
    background-color: rgba(169, 152, 255, 0.05);
    color: rgb(169, 152, 255);
    padding: 10px;
    border-radius: 10px;
    text-align: left;
    @media (max-width: 1000px) {
      text-align: left;
      
    }
  `

  return (
    <Section2Wrap>
      <Top>
        <Left>
          <FloatingApps>
            <AppContainer delay={0.5}><img style={{ width: '10rem' }} src={snapshot_logo} /></AppContainer>
            <AppContainer delay={1}><img style={{ width: '10rem' }} src={calendar_logo} /></AppContainer>
            <AppContainer delay={1.5}><img style={{ width: '10rem' }} src={docs_logo} /></AppContainer>
            <AppContainer delay={2}><img style={{ width: '15rem' }} src={contest_logo} /></AppContainer>
          </FloatingApps>
        </Left>
        <Right>
          <h1 style={{ color: "#d3d3d3" }}>Applications</h1>
          <Section2Text>
            <p style={{ margin: '0'}}>We build open source applications that live in community dashboards. Create a custom dashboard for your organization and add some apps to help fellow members keep up with the latest calendar events, snapshot votes, community documents, and more.</p>
          </Section2Text>
        </Right>
      </Top>

      <Bottom>
        <Left>
          <h1 style={{ color: "#d3d3d3" }}>Gatekeeper</h1>
          <Section2Text>
            <p style={{ margin: '0'}}>Give potential contributors the pitch. Give OG's the alpha. Use Discord server role checks or ERC-721 & ERC-20 balance checks to create gatekeeper rules that uniquely affect each application.</p>
          </Section2Text>
        </Left>

        <Right>
          <img style={{ maxWidth: '100%' }} src={gatekeeper_img} />
        </Right>

      </Bottom>

    </Section2Wrap>
  )
}



function Section3() {


  const Section3Wrap = styled.div`
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
    text-align: center;
    width: 95%;
    margin: 0 auto;
    > * {
      margin-bottom: 30px;
    }
  `

  const Section3Split = styled.div`
    display: flex;
  `

  const Section3Heading = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    > * {
      margin: 10px;
    }
  `

  const Section3Text = styled.div`
    color: #d3d3d3;
    width: 90%;
    font-size: 20px;
    background-color: rgba(169, 152, 255, 0.05);
    color: rgb(169, 152, 255);
    padding: 10px;
    border-radius: 10px;
    margin-top: 50px;
    margin-bottom: 100px;
    text-align: left;
    @media (max-width: 1000px) {
      text-align: left;
      
    }
  `

  return (
    <Section3Wrap>
      <Section3Heading>
        <h2 style={{ color: '#d3d3d3' }}>A peak inside the lab </h2>
        <FontAwesomeIcon icon={faVial} fontSize="30px" color="lightgreen"></FontAwesomeIcon>
      </Section3Heading>
      <Section3Split>
        <Bottom>
          <Left>
            <img src={inTheLab} style={{ maxWidth: '50%' }} />
          </Left>
          <Right>
            <Section3Text>
              <p style={{ margin: '0' }}>
                We've teamed up with SharkDAO to develop Creator Contests.
                Creator contests are an experiment in creating incentive systems for community creatives,
                builders, and artists via retroactive rewards.
                <br></br><br></br>
                Reward pools are reserved for winners of periodic contests.
                At the close of a contest submission period, DAO members vote on submissions and rewards are
                distributed according to the voting results. Coming Soon.
              </p>
            </Section3Text>

          </Right>
        </Bottom>
      </Section3Split>
    </Section3Wrap>
  )
}





function Footer() {

  const FooterWrap = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    padding-bottom: 40px;
    justify-content: center;
    width: 90%;
    margin: 0 auto;
    border-top: 2px solid #1c2128;
    padding-top: 50px;

    @media (max-width: 800px){
    grid-template-rows: 1fr 1fr;
    grid-template-columns: none;
    margin-bottom: 40px;
  }
  `

  const LinksWrap = styled.div`
    display: flex;
    grid-gap: 20px;
    justify-content: center;

    > * {
      margin: 15px;
    }

  `

  return (
    <FooterWrap>
      <LinksWrap>
        <a href="https://github.com/calabara-hq" target={"_blank"} style={{ textAlign: 'center' }}><FontAwesomeIcon icon={faGithub}></FontAwesomeIcon></a>
        <a href="https://twitter.com/calabarahq" target={"_blank"} style={{ textAlign: 'center' }}><FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon></a>
        <a href="'https://discord.gg/dBBzHe9k3E'" target={"_blank"} style={{ textAlign: 'center' }}><FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon></a>
        <a href="https://docs.calabara.com/welcome/calabara" target={"_blank"} style={{ textAlign: 'center' }}><FontAwesomeIcon icon={faBook}></FontAwesomeIcon></a>

      </LinksWrap>
      <img style={{ maxWidth: '100%', marginLeft: 'auto' }} src={blueprint_img}></img>
    </FooterWrap>
  )
}


export default Homepage;

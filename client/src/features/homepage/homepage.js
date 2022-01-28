import '../../css/homepage.css'

function Homepage() {


  return(
    <div className="homepageContainer">
      <section className="section1">
      <div className="stripe1">
      </div>
      <div className="stripe2">
      </div>
      <div className="stripe3">
      </div>
      <div className="stripe4">
      </div>
      <div className="stripe5">
      </div>
      <div className="stripe6">
      </div>
      <div className="stripe7">
      </div>
      <div className="stripe8">
      </div>

      <div className="section1Content">
      <h1>Give your community superpowers.</h1>
      <p> calabara is a DAO that builds web3 tools for online communities </p>
      <button onClick={() => {window.open('explore')}}className="launchAppBtn big">Launch App</button>
      </div>
      </section>
    </div>
  )

}

export default Homepage;

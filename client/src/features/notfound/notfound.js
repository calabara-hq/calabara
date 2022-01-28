import React from 'react'
import '../../css/notfound.css'


export default function Notfound(){


  return(
    <div className="notfound">
    <h1>Nice try. We'll see you soon.</h1>
    <h1> Join us on discord!</h1>
    <button onClick={()=>window.open('https://discord.gg/dBBzHe9k3E')}> Join Calabara </button>

    </div>
  )

}

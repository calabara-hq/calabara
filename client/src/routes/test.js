import { useEffect } from "react"




export default function Test({ }) {
    useEffect(() => {
        console.log('hi')
    }, [])
    return <p>hi!!!</p>
}
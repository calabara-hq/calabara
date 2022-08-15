import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"

/**
 * 
 * 0x1 = token
 * 0x2 = arcade
 */

/**
 * 
 * query db for votes cast by a wallet
 * calculate remaining voting power based on strategy
 * 
 */


const calculateVotingPower = (strategy, wallet, contest_hash) => {
    if (strategy === 0x1) return 20
    else if (strategy === 0x2) return 50

}

export { calculateVotingPower }
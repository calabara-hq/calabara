import axios from 'axios'
import wrapPromise from '../../../../helpers/wrap-promise'

const fetchContests = (ens) => {
    const promise = fetch(`/creator_contests/fetch_org_contests/${ens}`)
        .then(data => data.json())
    return wrapPromise(promise)
}

const fetchStats = (ens) => {
    const promise = fetch(`/creator_contests/org_contest_stats/${ens}`)
        .then(data => data.json())
    return wrapPromise(promise)
}


const fetchHomePageData = (ens) => {
  //  let ens = window.location.pathname.split('/')[1]
    return {
        contests: fetchContests(ens),
        stats: fetchStats(ens)
    }



    /*
    return Promise.all([
        fetchContests(ens),
        fetchStats(ens)
    ]).then(([contests, stats]) => {
        return { contests, stats }
    })
    */
}


export default fetchHomePageData
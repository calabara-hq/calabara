import axios from 'axios'
import wrapPromise from '../../../../helpers/wrap-promise'

const fetchContests = (ens) => {
    const promise = fetch(`/creator_contests/fetch_org_contests/${ens}`)
        .then(data => data.json())
    return wrapPromise(promise)
}

const fetchStats = (ens) => {
    const promise = fetch(`/creator_contests/org_contest_stats?ens=${ens}`)
        .then(data => data.json())
    return wrapPromise(promise)
}

const fetchInfo = (ens) => {
    const promise = fetch(`/dashboard/dashboardInfo/${ens}`)
        .then(data => data.json())
    return wrapPromise(promise)
}


export const fetchHomePageData = (ens) => {
    return {
        contests: fetchContests(ens),
        stats: fetchStats(ens),
        info: fetchInfo(ens)
    }
}

// return a non resolving promise so we can call fetchHomePageData when component re renders (without calling it twice)
export const initialize = () => {
    return {
        contests: wrapPromise(new Promise(() => { })),
        stats: wrapPromise(new Promise(() => { })),
        info: wrapPromise(new Promise(() => { }))
    }
}



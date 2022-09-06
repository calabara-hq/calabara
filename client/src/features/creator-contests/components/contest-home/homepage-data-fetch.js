import axios from 'axios'


function wrapPromise(promise) {
    let status = 'pending'
    let response

    const suspender = promise.then(
        (res) => {
            status = 'success'
            response = res
        },
        (err) => {
            status = 'error'
            response = err
        },
    )
    const read = () => {
        switch (status) {
            case 'pending':
                throw suspender
            case 'error':
                throw response
            default:
                return response
        }
    }

    return { read }
}







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


const fetchHomePageData = () => {
    let ens = window.location.pathname.split('/')[1]
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
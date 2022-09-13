import wrapPromise from "../../../../../helpers/wrap-promise"



const fetchSubmssionUrls = (contest_state, ens, contest_hash) => {
    if (contest_state < 2) {
        const promise = fetch(`/creator_contests/fetch_submissions/${ens}/${contest_hash}`)
            .then(data => data.json())
            .then(subs => {
                return subs.map(sub => {
                    sub.submission_data = fetchSubmission(sub._url)
                    return sub
                })
            })
        return wrapPromise(promise)
    }

    else {
        const promise = fetch(`/creator_contests/fetch_contest_winners/?ens=${ens}&contest_hash=${contest_hash}`)
            .then(data => data.json())
            .then(subs => {
                return subs.map(sub => {
                    sub.submission_data = fetchSubmission(sub._url)
                    return sub
                })
            })
        return wrapPromise(promise)
    }

}


const fetchSubmission = (url) => {
    const promise = fetch(url)
        .then(data => data.json())
    return wrapPromise(promise)

}

export { fetchSubmission, fetchSubmssionUrls }
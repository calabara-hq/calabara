import wrapPromise from "../../../../../helpers/wrap-promise"


const fetchContest = (ens, contest_hash) => {
    const promise = fetch(`/creator_contests/fetch_contest/${ens}/${contest_hash}`)
        .then(data => data.json())
    return wrapPromise(promise)

}

export default fetchContest
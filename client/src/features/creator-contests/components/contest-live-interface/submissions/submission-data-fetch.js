import wrapPromise from "../../../../../helpers/wrap-promise"

const fetchSubmission = (url) => {
    const promise = fetch(url)
        .then(data => data.json())
    return wrapPromise(promise)

}

export default fetchSubmission
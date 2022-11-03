import wrapPromise from '../../helpers/wrap-promise'


export const fetchOrganizations = () => {
    const promise = fetch('/organizations/organizations/')
        .then(data => data.json())
    return wrapPromise(promise)
}
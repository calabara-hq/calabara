const db = require('../../database/database')
import { QueryData } from "../../helpers/interfaces"


export const fetchOrganizations = async (): Promise<QueryData> => {
    let query: string = `
        select * from organizations
    `;
    return await db.query(query);
}

export const fetchOrganization = async (ens: string): Promise<QueryData> => {
    let query: string = `
        select * from organizations where ens = $1
    `
    return await db.query(query, [ens])
}

export const doesNameExist = async (name: string, ens: string): Promise<QueryData> => {
    let query: string = `
        select exists (select id from organizations where name = $1 and ens != $2)
    `;
    return await db.query(query, [name, ens]);
}

export const doesEnsExist = async (ens: string): Promise<QueryData> => {
    let query: string = `
        select exists (select id from organizations where ens = $1)
    `;
    return await db.query(query, [ens])
}

export const getUserSubscriptions = async (address: string): Promise<QueryData> => {
    let query: string = `
        select subscription from subscriptions where address = $1
    `
    return await db.query(query, [address])
}

export const addUserSubscription = async (ens: string, address: string) => {
    let query1: string = `
        insert into subscriptions (address, subscription) values ($1, $2)
    `
    let query2: string = `
        update organizations set members = members + 1 where ens = $1
    `
    return await Promise.all([
        db.query(query1, [address, ens]),
        db.query(query2, [ens])
    ])
}

export const removeUserSubscription = async (ens: string, address: string) => {
    let query1: string = `
        delete from subscriptions where address = $1 AND subscription = $2
    `
    let query2: string = `
        update organizations set members = members - 1 where ens = $1
    `
    return await Promise.all([
        db.query(query1, [address, ens]),
        db.query(query2, [ens])
    ])
}
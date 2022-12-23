import db from './database';
import { asArray, clean } from '../../lib/helpers';
import { QueryData } from '../../lib/interfaces';

export const getDashboardInfo = async (ens: string): Promise<any> => {
    let query = `
        select name, ens, logo, members, website, discord, verified, addresses from organizations where ens = $1
    `;
    return await db.query(query, [ens])
        .then(clean);
}

export const getDashboardRules = async (ens: string): Promise<any> => {
    let query = `
        select json_agg(rule) as rules from gatekeeper_rules where ens = $1
    `;
    return await db.query(query, [ens])
        .then(clean)
        .then((data: any) => data.rules)
}

export const getDashboardWidgets = async (ens: string) => {
    let query1 = `
        select ens, gatekeeper_rules, name, metadata from widgets where ens = $1
    `
    let query2 = `
        select name from supported_widgets except select name from widgets where ens=$1
    `
    let [installed, installable] = await Promise.all([
        db.query(query1, [ens]).then(clean).then(asArray),
        db.query(query2, [ens]).then(clean).then(asArray)
    ])

    return { installed, installable }
}


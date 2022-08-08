const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const dashboard = express();
dashboard.use(express.json())
const asyncfs = require('fs').promises;
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { isAdmin } = require('../middlewares/admin-middleware')
const { clean, asArray } = require('../helpers/common')
const { getGuildRoles } = require('./discord-routes')
const googleCalendar = require('../helpers/google-calendar');
const { default: axios } = require('axios');


const serverRoot = path.normalize(path.join(__dirname, '../'));


// we need to change all occurances of gatekeeperType to type, and so on for other gatekeeper data.
// additionally, we need to add a decimal of 0 for erc721 rules
const apply_GK_DB_patch = async() => {
    await db.query('update gatekeeper_rules set rule = rule - \'gatekeeperType\' || jsonb_build_object(\'type\', rule-> \'gatekeeperType\') where rule ? \'gatekeeperType\'');
    await db.query('update gatekeeper_rules set rule = rule - \'gatekeeperSymbol\' || jsonb_build_object(\'symbol\', rule-> \'gatekeeperSymbol\') where rule ? \'gatekeeperSymbol\'');
    await db.query('update gatekeeper_rules set rule = rule - \'gatekeeperAddress\' || jsonb_build_object(\'address\', rule-> \'gatekeeperAddress\') where rule ? \'gatekeeperAddress\'');
    await db.query('update gatekeeper_rules set rule = rule - \'gatekeeperDecimal\' || jsonb_build_object(\'decimal\', rule-> \'gatekeeperDecimal\') where rule ? \'gatekeeperDecimal\'');
    await db.query('update gatekeeper_rules set rule = rule || \'{"decimal":"0"}\' where rule->>\'type\' = \'erc721\';');


}

// remove key
// update gatekeeper_rules set rule = rule #- '{hehe}' where rule_id = 74;

let orgs = ['calabara.eth', 'sharkdao.eth', 'yungweez.eth'];
let rules = [
    {"type": "erc20", "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"},
    {"type": "discord", "guildId": "892877917762244680", "serverName": "Calabara"},
    {"type": "erc20", "gatekeeperSymbol": "SHARK", "gatekeeperAddress": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931", "gatekeeperDecimal": "18"},
    {"type": "discord", "guildId": "892877917762244680", "serverName": "Calabara"},
    {"type": "erc20", "gatekeeperSymbol": "KRAUSE", "gatekeeperAddress": "0x9F6F91078A5072A8B54695DAfA2374Ab3cCd603b", "gatekeeperDecimal": "18"},
    {"type": "erc721", "symbol": "0", "gatekeeperSymbol": "MFER", "gatekeeperAddress": "0x79FCDEF22feeD20eDDacbB2587640e45491b757f"},
    {"type": "erc721", "symbol": "0", "gatekeeperSymbol": "NOUN", "gatekeeperAddress": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"},
]

const refill_GK_DB = async() => {
    for (i in rules){
        await db.query('insert into gatekeeper_rules (ens, rule) values ($1, $2)', [orgs[0], rules[i]])
    }
}


//refill_GK_DB();
//apply_GK_DB_patch();


const getDashboardInfo = async (ens) => {
    var orgInfo = await db.query('select name, ens, logo, members, website, discord, verified, addresses from organizations where ens = $1', [ens.toLowerCase()]).then(clean);
    return orgInfo
}

const getDashboardRules = async (ens) => {
    var result = await db.query('select json_build_object (rule_id, rule) AS data from gatekeeper_rules where ens = $1', [ens]).then(clean).then(asArray)

    const buildObj = async () => {
        let obj = {}
        await Promise.all(result.map(async (el) => {
            const key = Object.keys(el.data);
            obj[key] = el.data[key];
            if (obj[key].type === 'discord') {
                let roles = await (getGuildRoles(obj[key].guildId))
                obj[key].available_roles = roles.map((el) => {
                    return { 'role_id': el.id, 'role_name': el.name, 'role_color': el.color }
                })
            }
        }))
        return obj
    }

    let ruleObject = await buildObj();
    return ruleObject
}

const getDashboardWidgets = async (ens) => {
    // get all the widgets for the org
    const installed = await db.query('select ens, gatekeeper_rules, name, metadata from widgets where ens = $1', [ens]).then(clean).then(asArray);
    const installable = await db.query('select name from supported_widgets except select name from widgets where LOWER(ens)=$1', [ens.toLowerCase()]).then(clean).then(asArray);

    return { installed, installable }
}




dashboard.get('/dashboardBatchData/*', async function (req, res, next) {
    var ens = req.url.split('/')[2];

    let [orgInfo, rules, widgets] = await Promise.all([getDashboardInfo(ens), getDashboardRules(ens), getDashboardWidgets(ens)])

    res.send({
        dashboardData: {
            orgInfo,
            rules,
            widgets
        }
    })
    res.status(200);
})


dashboard.get('/dashboardInfo/*', async function (req, res, next) {
    var ens = req.url.split('/')[2];
    // get the org info
    var orgInfo = await db.query('select name, ens, logo, members, website, discord, verified, addresses from organizations where ens = $1', [ens.toLowerCase()]).then(clean);
    res.status(200);
    res.send({ orgInfo: orgInfo })

})


// get rules
dashboard.get('/dashboardRules/*', async function (req, res, next) {

    const ens = req.url.split('/')[2];

    let ruleObject = await getDashboardRules(ens);

    res.status(200);
    res.send(ruleObject)
});


// insert the new widget into a dashboard widget collection
dashboard.post('/addWidget', authenticateToken, isAdmin, async function (req, res, next) {

    const { ens, name, metadata, widget_logo, gatekeeper_rules } = req.body;
    await db.query('insert into widgets (ens, name, metadata, gatekeeper_rules) values ($1, $2, $3, $4)', [ens, name, metadata, gatekeeper_rules]);

    res.status(200);
    res.send('done')

});

// remove the new widget from a dashboard widget collection
dashboard.post('/removeWidget', authenticateToken, isAdmin, async function (req, res, next) {

    console.log(req)
    const { ens, name } = req.body;
    await db.query('delete from widgets where ens = $1 and name = $2', [ens, name])
    if (name === 'wiki') {
        // remove the files and entries from DB
        await db.query('delete from wiki_groupings where ens = $1', [ens])
        await asyncfs.rm(path.normalize(path.join(serverRoot, 'org-repository/', ens, '/wiki')), { recursive: true });

    }
    res.status(200);
    res.send('done')

});


dashboard.post('/updateWidgetMetadata', authenticateToken, isAdmin, async function (req, res, next) {
    const { ens, metadata, name } = req.body;

    var result = await db.query('update widgets set metadata = $1 where ens=$2 and name=$3', [metadata, ens, name])
    res.status(200)
    res.send('ok')
})

dashboard.post('/updateWidgetGatekeeperRules', authenticateToken, isAdmin, async function (req, res, next) {
    const { ens, gk_rules, name } = req.body;

    var result = await db.query('update widgets set gatekeeper_rules = $1 where ens=$2 and name=$3', [gk_rules, ens, name])
    res.status(200)
    res.send('ok')
})


// fetch calendar metadata
dashboard.post('/fetchCalendarMetaData', async function (req, res, next) {

    const { calendarID } = req.body;
    var result = await googleCalendar.fetchCalendarMetaData(calendarID);
    res.send(result)

});


dashboard.post('/fetchCalendarEvents', async function (req, res, next) {

    const { calendarID, startTime, endTime } = req.body;
    var result = await googleCalendar.listEvents(calendarID, startTime, endTime);
    res.send(result)

});


module.exports.dashboard = dashboard;
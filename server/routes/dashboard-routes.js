const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const dashboard = express();
dashboard.use(express.json())
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { clean, asArray } = require('../helpers/common')
const { getGuildRoles } = require('./discord-routes')
const googleCalendar = require('../helpers/google-calendar')


const getDashboardInfo = async (ens) => {
    var orgInfo = await db.query('select name, ens, logo, members, website, discord, verified, addresses from organizations where ens = $1', [ens.toLowerCase()]).then(clean);
    return orgInfo
}

const getDashboardRules = async (ens) => {
    var result = await db.query('select json_build_object (rule_id, rule) AS data from gatekeeper_rules where ens = $1', [ens]).then(clean).then(asArray)

    let obj = {}
    let obj2 = {}

    const buildObj = async () => {
        let obj = {}
        await Promise.all(result.map(async (el) => {
            const key = Object.keys(el.data);
            obj[key] = el.data[key];
            if (obj[key].gatekeeperType === 'discord') {
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
dashboard.post('/addWidget', async function (req, res, next) {

    const { ens, name, metadata, widget_logo, gatekeeper_rules } = req.body;
    await db.query('insert into widgets (ens, name, metadata, gatekeeper_rules) values ($1, $2, $3, $4)', [ens, name, metadata, gatekeeper_rules]);

    res.status(200);
    res.send('done')

});

// remove the new widget from a dashboard widget collection
dashboard.post('/removeWidget', async function (req, res, next) {


    const { ens, name } = req.body;
    await db.query('delete from widgets where ens = $1 and name = $2', [ens, name])
    res.status(200);
    res.send('done')

});


dashboard.post('/updateWidgetMetadata', async function (req, res, next) {
    const { ens, metadata, name } = req.body;

    var result = await db.query('update widgets set metadata = $1 where ens=$2 and name=$3', [metadata, ens, name])
    res.status(200)
    res.send('ok')
})

dashboard.post('/updateWidgetGatekeeperRules', async function (req, res, next) {
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

dashboard.post('/sample_jwt_route', authenticateToken, async function (req, res, next) {
    console.log(req.user.address)
    res.status(200);
    res.send('OK')

});

module.exports.dashboard = dashboard;
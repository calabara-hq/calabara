const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const wiki = express();
const asyncfs = require('fs').promises;
wiki.use(express.json())
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const {clean, asArray} = require('../helpers/common')


const serverRoot = path.normalize(path.join(__dirname, '../'));



// read data from a wiki by id.
// return the file and return the permissions from db

wiki.get('/readWiki/*', async function (req, res, next) {

    const file_id = req.url.split('/')[2];

    var result = await db.query('select title, id, location, grouping from wikis where id = $1', [file_id]).then(clean)

    var file_data = await asyncfs.readFile(path.normalize(path.join(serverRoot, '/', result.location, file_id, '.json')), 'utf8')
    res.status(200);
    res.send({ metadata: result, filedata: JSON.parse(file_data) })
});


wiki.get('/fetchWikis/*', async function (req, res, next) {
    const ens = req.url.split('/')[2];

    /* 
    we want a structure like this ...
  
    {
      1: 
        name: group_name,
        rules: {rule_id: threshold ...}
    }
    */

    //const groupings = await db.query('select json_build_object(group_id, json_build_object(\'name\', name, \'rules\', gk_rules)) as data from wiki_groupings where ens = $1', [ens]).then(clean)
    const groupings = await db.query('select group_id, name, gk_rules from wiki_groupings where ens = $1', [ens]).then(clean).then(asArray)
    const wikis = await db.query('select id::text, title, grouping from wikis where ens = $1', [ens]).then(clean).then(asArray)


    let groupingObj = {}
    let wikisObj = {}

    groupings.map((item) => {
        groupingObj[item.group_id] = { group_name: item.name, gk_rules: item.gk_rules, list: [] }
    })

    wikis.map((item) => {
        groupingObj[item.grouping]['list'].push(item)
    })


    res.send(groupingObj)

    res.status(200)

})

wiki.post('/writeWikiInitial', async function (req, res, next) {


    const { ens, data } = req.body;
    const folderpath = path.normalize(path.join(serverRoot, '/org-repository/', ens, '/wiki/', data.metadata.grouping, '/'))
    const title = data.filedata.title


    var result = await db.query('insert into wikis (ens, title, location, grouping) values ($1, $2, $3, $4) returning id', [ens, title, folderpath, data.metadata.grouping]).then(clean)


    try {
        await asyncfs.mkdir(folderpath, { recursive: true })
    }
    catch (e) { console.log(e) }
    await asyncfs.writeFile(folderpath + result.id + '.json', JSON.stringify({ title: data.filedata.title, content: data.filedata.content }));
    res.status(200);
    res.send('OK')

});


wiki.post('/updateWiki', async function (req, res, next) {

    const { file_id, data } = req.body;
    const result = await db.query('update wikis set title = $1 where id = $2 returning location', [JSON.parse(data).title, file_id]).then(clean)
    await asyncfs.writeFile(path.normalize(path.join(serverRoot, result.location, file_id, '.json')), data);
    res.status(200);
    res.send('OK')


});

wiki.post('/deleteWiki', async function (req, res, next) {

    // the new orderedList will maintain an order that will inform us about which element needs to become the new leader
    const { file_id } = req.body;
    const result = await db.query('delete from wikis where id = $1 returning location', [file_id]).then(clean);
    await asyncfs.unlink(path.normalize(path.join(serverRoot, result.location, file_id, '.json')))


});

wiki.post('/addWikiGrouping', async function (req, res, next) {
    const { ens, groupingName, gk_rules } = req.body;

    const result = await db.query('insert into wiki_groupings (name, ens, gk_rules) values ($1, $2, $3) returning group_id', [groupingName, ens, gk_rules]).then(clean)

    const folderpath = path.normalize(path.join(serverRoot, 'org-repository/', ens, '/wiki/', JSON.stringify(result.group_id)));


    try {
        await asyncfs.mkdir(folderpath, { recursive: true })
    }
    catch (e) { console.log(e) }

    res.send(result)
})

wiki.post('/updateWikiGrouping', async function (req, res, next) {
    const { groupID, ens, groupingName, gk_rules } = req.body;

    const result = await db.query('update wiki_groupings set name=$1, ens=$2, gk_rules=$3 where group_id = $4', [groupingName, ens, gk_rules, groupID])
    res.send('OK')
})

wiki.post('/deleteWikiGrouping', async function (req, res, next) {
    const { ens, groupID } = req.body;

    const result = await db.query('delete from wiki_groupings where group_id = $1', [groupID]);
    try {
        await asyncfs.rmdir(path.normalize(path.join(serverRoot, 'org-repository/', ens, '/wiki/', groupID)), { recursive: true });
    } catch (e) { console.log(e) }

    res.send('OK')
})

wiki.post('/updateWikiLists', async function (req, res, next) {

    const { ens, file_id, new_grouping } = req.body;
    const result = await db.query('update wikis set grouping = $1 where id = $2', [new_grouping, file_id])


    res.status(200);
    res.send('OK')

});


module.exports.wiki = wiki;
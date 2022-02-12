const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const asyncfs = require('fs').promises;
const views = require('co-views')
const { Pool } = require('pg')
const bodyParser = require('body-parser')
const googleCalendar = require('./google-calendar')
const dotenv = require('dotenv');
dotenv.config();

console.log(`mode is  ${process.env.NODE_ENV}`)


if(!process.env.NODE_ENV){
  console.log('please pass NODE_ENV. Available options are dev and prod')
}

let config, key, cert

if(process.env.NODE_ENV == 'production'){
  console.log('production run')
  config = {
    db:{
      user: process.env.PROD_DB_USER,
      host: process.env.PROD_DB_HOST,
      database: process.env.PROD_DB,
      password: process.env.PROD_DB_PASSWORD,
      port: process.env.PROD_DB_PORT,
    }
    };
    
    cert = fs.readFileSync("localhost.cert", "utf-8");
    key = fs.readFileSync("localhost.key", "utf-8");
}

if(process.env.NODE_ENV == 'development'){
  console.log('development run')

  config = {
    db:{
      user: process.env.DEV_DB_USER,
      host: process.env.DEV_DB_HOST,
      database: process.env.DEV_DB,
      password: process.env.DEV_DB_PASSWORD,
      port: process.env.DEV_DB_PORT,
    }
  };

  cert = fs.readFileSync("localhost.cert", "utf-8");
  key = fs.readFileSync("localhost.key", "utf-8");
}



const db = new Pool(config.db)


const buildPath = path.normalize(path.join(__dirname, '../client/build'));
app.use(express.static(buildPath));

const imgPath = path.normalize(path.join(__dirname, 'img'));
app.use(express.static(imgPath));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json())



app.get('/img/*', function(req, res, next){
  res.sendFile(path.join(imgPath, req.url.split('/').slice(2).join('/')))

})



async function query(query, params) {
    const data = await pool.query(query, params);
    return data;
}


function clean(data){
  if(data.rows.length == 0) {return null}
  else if(data.rows.length == 1){return data.rows[0]}
  else{return data.rows}

}

// adjust db result to make sure we always get data in an array or null.
function asArray(data){
  if(Array.isArray(data)){
    return data
  }
  else if (data != null ){
    return [data]
  }
  return []

}


async function dataUrlToFile(url, filename){
  var regex = /^data:.+\/(.+);base64(.*)$/;

  var matches = url.split(',');
  var ext = matches[0].match(regex)[1]
  var data = matches[1]
  if(ext == 'svg+xml'){ext = 'svg'}

  try{
  var buffer = Buffer.from(',' + data, 'base64');
  var filepath = 'img/logos/' + filename + '.' + ext;
  await asyncfs.writeFile(filepath, buffer);
  return filepath

}catch(e){
    console.log(e)
  }
}

async function fileToDataUrl(filePath){
  var base64Image = await asyncfs.readFile(filePath, {encoding: 'base64'});
  var fileExt = filePath.split('.').pop();
  var encoded = 'data:image/' + fileExt + ';base64,' + base64Image;
  return encoded

}


app.get('/doesEnsExist/*', async function(req, res, next){

    const ens = req.url.split('/')[2]

    var result = await db.query('select exists (select id from organizations where ens = $1)', [ens]).then(clean);

    res.status(200);
    res.send(result.exists)

});

/* 
this is more complex in the case that a user is updating an orgs settings.
in the simple case (new org), we just need to make sure that the name is unique
in the complex case (existing org), the name can exist so long as it is only owned by the ens it's tied to.
*/
app.post('/doesNameExist', async function(req, res, next){

    const {name, ens} = req.body;
    var result = await db.query('select exists (select id from organizations where name = $1 and ens != $2)', [name.toLowerCase(), ens]).then(clean);
    res.status(200);
    res.send(result.exists)

});



app.get('/organizations', async function(req, res, next){

    var result = await db.query('select name, members, logo, verified, ens from organizations').then(clean).then(asArray);

    res.status(200);
    //
    res.send(result)

});

app.get('/getSettings/*', async function(req, res, next){

  var ens = req.url.split('/')[2];

    // pull settings from db based on ens

    var result = await db.query('select * from organizations where ens = $1', [ens]).then(clean).then(asArray);

    // to be consistent, we need to convert the image to base64 encoded before we send it back to the client
    if(result.length > 0){
      result[0].logo = await fileToDataUrl(result[0].logo)
    }

    res.status(200);
    //
    res.send(result)

});





app.get('/availableWidgets/*', async function(req, res, next){

  var ens = req.url.split('/')[2];

    // get the list of already installed widgets
    // var installed = req.body
    // installed = new Set(installed.map(({name}) => name));

    // get the list of all supported widgets that are not present in widgets already
    var installable = await db.query('select name from supported_widgets except select name from widgets where LOWER(ens)=$1',[ens.toLowerCase()]).then(clean).then(asArray);


    res.status(200);
    res.send({items: installable})

});

app.get('/dashboardInfo/*', async function(req, res, next){
  var ens = req.url.split('/')[2];
  // get the org info
  var orgInfo = await db.query('select name, ens, logo, members, website, discord, verified, addresses from organizations where ens = $1', [ens.toLowerCase()]).then(clean);
  res.status(200);
  res.send({orgInfo: orgInfo})

})


app.get('/dashboardWidgets/*', async function(req, res, next){
  //TODO change this. the orgname may not necc be a part of the url
  var ens = req.url.split('/')[2];


    // get all the widgets for the org
    var widgets = await db.query('select ens, gatekeeper_rules, name, metadata from widgets where ens = $1', [ens]).then(clean).then(asArray);

   res.status(200);
   res.send({widgets: widgets })

});


// get subscriptions
app.get('/getSubscriptions/*', async function(req, res, next){

  const address = req.url.split('/')[2];

  var subbed = await db.query('select subscription from subscriptions where address = $1', [address]).then(clean).then(asArray);
  res.status(200);
  res.send(subbed.map(el => el.subscription))

});

// get wikis
app.get('/wikiList/*', async function(req, res, next){

  const ens = req.url.split('/')[2];

  var result = await db.query('select title, id, access, foremost from wikis where ens = $1', [ens]).then(clean).then(asArray)
  res.status(200);
  res.send(result)

});


// get rules
app.get('/dashboardRules/*', async function(req, res, next){


  /* 
  query the db and format data as follows
  {
    1: {},
    2: {},
    3: {},
    ...
  }
*/


  const ens = req.url.split('/')[2];

  var result = await db.query('select json_build_object (rule_id, rule) AS data from gatekeeper_rules where ens = $1', [ens]).then(clean).then(asArray)
  let obj = {}
  

  result.map((el) => {
    const key = Object.keys(el.data);

    obj[key] = el.data[key];

  })
  res.status(200);
  res.send(obj)
});

// read data from a wiki by id.
// return the file and return the permissions from db

app.get('/readWiki/*', async function(req, res, next){

  const file_id = req.url.split('/')[2];

  var result = await db.query('select title, id, location, grouping from wikis where id = $1', [file_id]).then(clean)

  var file_data = await asyncfs.readFile(result.location + file_id + '.json', 'utf8')
  res.status(200);
  res.send({metadata: result, filedata: JSON.parse(file_data)})
});


// check if gatekeeper is on
app.get('/isGatekeeperEnabled/*', async function(req, res, next){

  const ens = req.url.split('/')[2];

  var result = await db.query('select gatekeeperaddress from organizations where ens = $1', [ens]).then(clean)
  if(result.gatekeeperaddress.length > 0){
    res.send(true)
  }
  else{
    res.send(false)
  }

  res.status(200);

});

app.get('/fetchWikiGrouping/*', async function(req, res, next){
  const ens = req.url.split('/')[2];


  const result = await db.query('select name, group_id, gk_rules, json_agg( \
    json_build_object(\
      \'title\', title, \'id\', id::text, \'prefix\', name)) as list from wikis inner join wiki_groupings on wiki_groupings.group_id = wikis.grouping group by name, gk_rules, group_id').then(clean)



  res.send(result)
  res.status(200)
    })



app.get('/fetchWikis/*', async function(req, res, next){
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
    groupingObj[item.group_id] = {group_name: item.name, gk_rules: item.gk_rules, list: []}
  })

  wikis.map((item) => {
    groupingObj[item.grouping]['list'].push(item)
  })


  res.send(groupingObj)

  res.status(200)

    })



app.post('/deleteOrganization', async function(req, res, next){
  const {ens} = req.body;



  await db.query('delete from organizations where ens = $1', [ens]);

  await asyncfs.rmdir('org-repository/' + ens, {recursive: true});

  res.status(200)
  res.send('ok')



});

app.post('/valid_wl', async function(req, res, next){
  const {address} = req.body

  const result = await db.query('select exists (select 1 from whitelist where address = $1)', [address]).then(clean);
  console.log(address)
  console.log(result.exists)
  res.send(result.exists)
  res.status(200);

})

app.post('/updateSettings', async function(req, res, next){

 /*
  place rules in rule table
  place settings in organizations table
  
 */


  const fields = req.body
  let logoPath;

  // prep the logo path if a logo was provided
  if(fields.logo){

    if(fields.logo == '/img/logos/default-logo.svg'){
      // if they haven't changed from the default, leave it as-is
      logoPath = fields.logo
    }
    else{
    logoPath = await dataUrlToFile(fields.logo, encodeURIComponent(fields.ens))
    }
  }
  else{
    // give them a default logo if they haven't provided one
    logoPath = '/img/logos/default-logo.svg'
  }



  await db.query('insert into organizations (name, members, website, discord, logo, addresses, verified, ens)\
  values ($1, $2, $3, $4, $5, $6, $7, $8)\
  on conflict (ens)\
  do update set name=$1, members=$2, website=$3, discord=$4, logo=$5, addresses=$6, verified=$7', [fields.name, fields.members || 0, fields.website, fields.discord, logoPath, fields.addresses, false, fields.ens])


  for(var rule in fields.gatekeeper.rules){
   await db.query('insert into gatekeeper_rules (ens, rule) values($1, $2)', [fields.ens, fields.gatekeeper.rules[rule]])
  }

  //if we deleted any rules, now is the time to remove them from affected widgets
  for(const i in fields.gatekeeper.rulesToDelete){
      await db.query("update widgets set gatekeeper_rules = gatekeeper_rules #- $1 where ens = $2", ['{' + fields.gatekeeper.rulesToDelete + '}', fields.ens])
     
    }
    
  

  res.send({error: 0})


  res.status(200);


});

// insert the new widget into an organizations widget collection
app.post('/addWidget', async function(req, res, next){

  const {ens, name, metadata, widget_logo, gatekeeper_rules} = req.body;
  await db.query('insert into widgets (ens, name, metadata, gatekeeper_rules) values ($1, $2, $3, $4)', [ens, name, metadata, gatekeeper_rules]);

  res.status(200);
  res.send('done')

});

// remove the new widget from an organizations widget collection
app.post('/removeWidget', async function(req, res, next){


  const {ens, name} = req.body;
  await db.query('delete from widgets where ens = $1 and name = $2', [ens, name])
  res.status(200);
  res.send('done')

});


// post a new subscription
app.post('/addSubscription', async function(req, res, next){

  const {address, ens} = req.body;

  await db.query('insert into subscriptions (address, subscription) values ($1, $2)', [address, ens]);
  await db.query('update organizations set members = members + 1 where ens = $1', [ens])
  res.status(200);
  res.send('done')

});

// remove a new subscription
app.post('/removeSubscription', async function(req, res, next){

  const {address, ens} = req.body;
  await db.query('delete from subscriptions where address = $1 AND subscription = $2', [address, ens]);
  await db.query('update organizations set members = members - 1 where ens = $1', [ens])
  res.status(200);
  res.send('done')

});


// fetch calendar metadata
app.post('/fetchCalendarMetaData', async function(req, res, next){

  const {calendarID} = req.body;
  var result = await googleCalendar.fetchCalendarMetaData(calendarID);
  res.send(result)

});


app.post('/fetchCalendarEvents', async function(req, res, next){

  const {calendarID, startTime, endTime} = req.body;
  var result = await googleCalendar.listEvents(calendarID, startTime, endTime);
  res.send(result)

});


app.post('/updateWidgetMetadata', async function (req, res, next){
  const {ens, metadata, name} = req.body;

  var result = await db.query('update widgets set metadata = $1 where ens=$2 and name=$3', [metadata, ens, name])
  res.status(200)
  res.send('ok')
})

app.post('/updateWidgetGatekeeperRules', async function (req, res, next){
  const {ens, gk_rules, name} = req.body;

  var result = await db.query('update widgets set gatekeeper_rules = $1 where ens=$2 and name=$3', [gk_rules, ens, name])
  res.status(200)
  res.send('ok')
})

app.post('/writeWikiInitial', async function(req, res, next){


  const {ens, data} = req.body;
  const folderpath = 'org-repository/' + ens + '/wiki/' + data.metadata.grouping + '/'
  const title = data.filedata.title


    var result = await db.query('insert into wikis (ens, title, location, grouping) values ($1, $2, $3, $4) returning id', [ens, title, folderpath, data.metadata.grouping]).then(clean)


  try{
    await asyncfs.mkdir(folderpath, {recursive: true})
  }
  catch(e){console.log(e)}
  await asyncfs.writeFile(folderpath + result.id + '.json', JSON.stringify({title: data.filedata.title, content: data.filedata.content}));
  res.status(200);
  res.send('OK')

});


app.post('/updateWiki', async function(req, res, next){

  const {file_id, data} = req.body;
  const result = await db.query('update wikis set title = $1 where id = $2 returning location', [JSON.parse(data).title, file_id]).then(clean)
  await asyncfs.writeFile(result.location + file_id + '.json', data);
  res.status(200);
  res.send('OK')


});



app.post('/deleteWiki', async function(req, res, next){

  // the new orderedList will maintain an order that will inform us about which element needs to become the new leader
  const {file_id} = req.body;
  const result = await db.query('delete from wikis where id = $1 returning location', [file_id]).then(clean);
  await asyncfs.unlink(result.location + file_id + '.json')


});

app.post('/addWikiGrouping', async function(req, res, next){
  const {ens, groupingName, gk_rules} = req.body;

  const result = await db.query('insert into wiki_groupings (name, ens, gk_rules) values ($1, $2, $3) returning group_id', [groupingName, ens, gk_rules]).then(clean)
 
  const folderpath = 'org-repository/' + ens + '/wiki/' + result.group_id;


  try{
    await asyncfs.mkdir(folderpath, {recursive: true})
  }
  catch(e){console.log(e)}

  res.send(result)
})

app.post('/updateWikiGrouping', async function(req, res, next){
  const {groupID, ens, groupingName, gk_rules} = req.body;

  const result = await db.query('update wiki_groupings set name=$1, ens=$2, gk_rules=$3 where group_id = $4', [groupingName, ens, gk_rules, groupID])
  res.send('OK')
})

app.post('/deleteWikiGrouping', async function(req, res, next){
  const {ens, groupID} = req.body;

  const result = await db.query('delete from wiki_groupings where group_id = $1', [groupID]);
  try{
    await asyncfs.rmdir('org-repository/' + ens + '/wiki/' + groupID, {recursive: true});
  }catch(e){console.log(e)}

  res.send('OK')
})

app.post('/updateWikiLists', async function(req, res, next){

  const {ens, file_id, new_grouping} = req.body;
  const result = await db.query('update wikis set grouping = $1 where id = $2', [new_grouping, file_id])

  
  res.status(200);
  res.send('OK')

});


app.get('/*',function(req,res, next){
  res.sendFile(path.join(buildPath, 'index.html'))
});

var server = http.createServer(app)
var secureServer = https.createServer({key, cert}, app);

if(process.env.NODE_ENV == 'development'){
  secureServer.listen(3001)
  console.log('Running at Port 3001');
}

else if(process.env.NODE_ENV === 'production'){
  server.listen(80)
  secureServer.listen(443)
  console.log('Running at Port 443');

}


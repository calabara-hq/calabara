import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import makeGatewaySchema from './graphql';
import { createYoga } from 'graphql-yoga';

//const authentication = require('../routes/authentication')
//const secure_session = require('../session/session')
const app = express();
const buildPath = path.normalize(path.join(__dirname, '../../../../client/build'));
const creatorContestDataPath = path.normalize(path.join(__dirname, '../../contest-assets'));
const imgPath = path.normalize(path.join(__dirname, '../../img'));


//app.use(secure_session)
app.use(express.json())
app.use(express.static(buildPath));
app.use(express.static(imgPath));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//app.use('/authentication', authentication)

//app.use('/hub/graphql', )



const yoga = createYoga({
    schema: makeGatewaySchema(),
    graphqlEndpoint: '/hub/graphql'
});

app.use('/hub/graphql', yoga)


/*
app.get('/img/*', function (req, res, next) {
    res.sendFile(path.join(imgPath, req.url.split('/').slice(2).join('/')))
})
 
app.get('/contest-assets/*', function (req, res, next) {
    res.sendFile(path.join(creatorContestDataPath, req.url.split('/').slice(2).join('/')))
})
 
 
app.get('/*', function (req, res, next) {
    res.sendFile(path.join(buildPath, 'index.html'))
});
*/

export default app;
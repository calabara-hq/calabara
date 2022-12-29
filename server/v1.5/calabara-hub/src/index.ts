import express from 'express';
import api from './services/index'
//import graphql from './graphql/index';
const app = express();

app.use('/hub', api)
//app.use('/hub/graphql', graphql)

const PORT = process.env.PORT || 5050
app.listen(PORT, () => console.log(`started on http://localhost:${PORT}`))
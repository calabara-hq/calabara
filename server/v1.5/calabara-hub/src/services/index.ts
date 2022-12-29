import express from 'express';
import rest from './rest';
import schema from './graphql';
import organizationsSchema from './organizations/organizations.schemas';
import { createYoga } from 'graphql-yoga';

const api = express();
const yoga = createYoga({
    schema: schema,
    graphqlEndpoint: '/hub/graphql'
});

api.use('/rest', rest)
api.use('/graphql', yoga)

export default api;
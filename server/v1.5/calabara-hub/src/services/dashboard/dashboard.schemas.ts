import { makeExecutableSchema } from '@graphql-tools/schema'
import path from 'path';
import fs from 'fs';
import resolvers from './dashboard.resolvers';
const schemaFile = path.join(__dirname, './dashboard.schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

const dashboardSchema = makeExecutableSchema({
    typeDefs,
    resolvers
})

export default dashboardSchema
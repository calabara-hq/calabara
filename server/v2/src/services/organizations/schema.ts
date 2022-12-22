import { makeExecutableSchema } from '@graphql-tools/schema'
import path from 'path';
import fs from 'fs';
import resolvers from './resolvers';
const schemaFile = path.join(__dirname, './schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

const organizationsSchema = makeExecutableSchema({
    typeDefs,
    resolvers
})

export default organizationsSchema
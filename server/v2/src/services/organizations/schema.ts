import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import path from 'path';
import fs from 'fs';
import { clean } from '../../lib/helpers';
import { fetchOrganization, fetchOrganizations } from "./methods";
const schemaFile = path.join(__dirname, './schema.graphql');

const { allStitchingDirectivesTypeDefs, stitchingDirectivesValidator } = stitchingDirectives();

const typeDefs = `
    ${allStitchingDirectivesTypeDefs}
    ${fs.readFileSync(schemaFile, 'utf8')}
`;


const resolvers = {
    Query: {
        organizationByEns: async (root: any, { ens }: any) => {
            return await fetchOrganization(ens)
                .then(clean)
        },
        organizations: async () => {
            return await fetchOrganizations()
                .then(clean);
        },
        _sdl: () => typeDefs
    },
}

const organizationSchema = makeExecutableSchema({
    typeDefs,
    resolvers
})

export default stitchingDirectivesValidator(organizationSchema)
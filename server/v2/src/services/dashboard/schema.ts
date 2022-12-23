import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import path from 'path';
import fs from 'fs';
import { getDashboardInfo, getDashboardRules, getDashboardWidgets } from "./methods";
const schemaFile = path.join(__dirname, './schema.graphql');

const { allStitchingDirectivesTypeDefs, stitchingDirectivesValidator } = stitchingDirectives();

const typeDefs = `
    ${allStitchingDirectivesTypeDefs}
    ${fs.readFileSync(schemaFile, 'utf8')}
`;

const resolvers = {
    Query: {
        //dashboard: async (root: any, { ens }: any) => { console.log(ens); return { ens } },//({ ens }),
        message: (ens: string) => {
            console.log('HERE')
            return {text: 'hello' }
        },
        /*
        rules: async (root: any, { ens }: any) => {
            console.log('HERE WE GO')
            const data = await getDashboardRules(ens)
            console.log('we here')
            //return { ens: ens }
            return data
            //return { ens: ens, rules: data }
        },
        */
        /*
        widgets: async (root: any, { ens }: any) => {
            const data = await getDashboardWidgets(ens)
            return { ens: ens, widgets: data }
        },
        */
        //dashboard: async (root: any, { ens }: any) => {
        //    return 'hello'
        //},
        _sdl: () => typeDefs,
    },

    /*
        Dashboard: {
            rules: async ({ ens }: any) => {
                console.log('here')
                const data = await getDashboardRules(ens)
                return data
            },
            widgets: async (root: any, { ens }: any) => {
                console.log(ens)
                const data = await getDashboardWidgets(ens)
                console.log(data)
                return data
            }
        }
        */
};

const dashboardSchema = makeExecutableSchema({
    typeDefs,
    resolvers
})

export default stitchingDirectivesValidator(dashboardSchema)
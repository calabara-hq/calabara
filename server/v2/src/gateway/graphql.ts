import waitOn from 'wait-on';
import { stitchSchemas } from '@graphql-tools/stitch';
import { introspectSchema } from '@graphql-tools/wrap';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import makeRemoteExecutor from '../lib/makeRemoteExecutor';
import { buildSchema } from 'graphql';


/*
const makeGatewaySchema = async () => {
    const organizationsExec: any = makeRemoteExecutor('http://localhost:5050/hub/graphql', { log: false });
    const dashboardExec: any = makeRemoteExecutor('http://localhost:5051/hub/graphql', { log: false });


    return stitchSchemas({
        subschemas: [
            {
                schema: await introspectSchema(organizationsExec),
                executor: organizationsExec,
                batch: true,
                merge: {
                    Organization: {
                        fieldName: 'organizationByEns',
                        selectionSet: '{ ens }',
                        args: originalObject => ({ ens: originalObject.ens })
                    }
                }
            },
            {
                schema: await introspectSchema(dashboardExec),
                executor: dashboardExec,
                batch: true,
                merge: {
                    Organization: {
                        fieldName: 'rules',
                        selectionSet: '{ ens }',
                        args: originalObject => ({ ens: originalObject.ens })
                    },
                }
            }
        ],
        mergeTypes: true
    })
}

*/


const { stitchingDirectivesTransformer } = stitchingDirectives();

const makeGatewaySchema = async () => {
    const organizationsExec: any = makeRemoteExecutor('http://localhost:5050/hub/graphql');
    const dashboardExec: any = makeRemoteExecutor('http://localhost:5051/hub/graphql');


    return stitchSchemas({
        subschemaConfigTransforms: [stitchingDirectivesTransformer],
        subschemas: [
            {
                schema: await fetchRemoteSchema(organizationsExec),
                executor: organizationsExec,
                batch: true
            },

            {
                schema: await fetchRemoteSchema(dashboardExec),
                executor: dashboardExec,
                batch: true
            }

        ],
        mergeTypes: true
    })
}

async function fetchRemoteSchema(executor: any) {
    const { data } = await executor({ document: '{ _sdl }' });
    return buildSchema(data._sdl);
}

export default makeGatewaySchema;
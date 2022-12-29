import { stitchSchemas } from '@graphql-tools/stitch'
import { fetchOrganization } from './organizations/organizations.methods'
import organizationsSchema from './organizations/organizations.schemas'
import dashboardSchema from './dashboard/dashboard.schemas'
//import { introspectSchema } from 'graphql-tools';
//import makeServer from ('./lib/make_server');
//import makeRemoteExecutor from ('./lib/make_remote_executor');

const masterSchema = stitchSchemas({
    subschemas: [organizationsSchema, dashboardSchema]
})

export default masterSchema

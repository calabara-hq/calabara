import waitOn from 'wait-on';
import { stitchSchemas } from '@graphql-tools/stitch';
import { introspectSchema } from '@graphql-tools/wrap';
import makeRemoteExecutor from '../lib/makeRemoteExecutor';


const makeGatewaySchema = async () => {
    const storefrontsExec: any = makeRemoteExecutor('http://localhost:5050/hub/graphql');


    return stitchSchemas({
        subschemas: [
            {
                schema: await introspectSchema(storefrontsExec),
                executor: storefrontsExec,
                batch: true,
                // While the Storefronts service also defines a `Product` type,
                // it contains no unique data. The local `Product` type is really just
                // a foreign key (`Product.upc`) that maps to the Products schema.
                // That means the gateway will never need to perform an inbound request
                // to fetch this version of a `Product`, so no merge query config is needed.
            }
        ]
    })
}

export default makeGatewaySchema;
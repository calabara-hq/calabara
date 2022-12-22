import express from 'express';
import { createYoga } from 'graphql-yoga';
import bodyParser from 'body-parser';

const makeServer = async (schema: any, name: string, port: number = 4000) => {
    const app = express();
    const yoga = createYoga({
        schema: schema,
        graphqlEndpoint: '/hub/graphql'
    })
    app.use(express.json())
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use('/hub/graphql', yoga)

    app.listen(port, () => console.log(`${name} running at http://localhost:${port}/hub/graphql`))
}


export default makeServer;
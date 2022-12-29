const logger = console.log//require('../logger.js').child({ service: 'authentication' })
const http = require('http');
//const app = require('./server/server')
const express = require('express');
const bodyParser = require('body-parser');
//const organizations = require('./routes/routes')
const database = require('./database/database');
//var server = http.createServer(app)
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');

const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "localhost";


const typeDefs = `
  type Organization { id: Int!, name: String!, members: Int!, website: String, discord: String, logo: String!, addresses: [String], verified: Boolean!, ens: String! }
  type Query { organizations: [Organization] }
`;

const resolvers = {
    Query: {
        organizations: async () => {
            const organizations = await database("organizations").select();
            return organizations;
        },
    },
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
    await server.start();

    app.use(
        bodyParser.json(),
        expressMiddleware(server),
    );

    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server ready`);
})()


/*
server.listen(5050, () => {
    console.log('organization service up and running');
})
*/
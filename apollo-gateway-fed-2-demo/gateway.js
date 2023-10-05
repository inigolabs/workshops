const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway } = require("@apollo/gateway");
const { Inigo, InigoRemoteDataSource, InigoSchemaManager } = require("inigo.js");
const { readFileSync } = require("fs");
const { resolve } = require("path");
require("dotenv").config()

// If you want to use a locally composed schema:
// 1. Run "inigo compose ./inigo/gateway.yaml > supergraph.graphql"
// 2. Add "LOCAL_COMPOSED_SCHEMA=supergraph.graphql" to the .env
// 3. Start the gateway with "npm run start-gateway"
// 4. If you change your local subgraph schemas, run "inigo compose" again and restart the gateway

var supergraphSchemaConfig;

if(process.env.LOCAL_COMPOSED_SCHEMA) {
    console.log("💻  You're using a local federated schema from .env.LOCAL_COMPOSED_SCHEMA");
    var cwd = resolve(__dirname, ".");
    var supergraphSdl = resolve(cwd, process.env.LOCAL_COMPOSED_SCHEMA);
    supergraphSchemaConfig = readFileSync(supergraphSdl, "utf-8");
}
else {
    console.log("⛅  You're using a federated schema pulled from Inigo's schema repository");
    supergraphSchemaConfig = new InigoSchemaManager()
}

const gateway = new ApolloGateway({
    supergraphSdl: supergraphSchemaConfig,
    buildService(service) {
        return new CustomRemoteDataSource(service, inigo);
    }
});

const inigo = new Inigo();

const server = new ApolloServer({
    gateway,
    plugins: [
        inigo.plugin(),
    ],
    introspection: true,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => console.log(`🚀  Supergraph ready at ${url}`));


// Optionally needed for headers to be propagated to the subgraphs
class CustomRemoteDataSource extends InigoRemoteDataSource {
    async onBeforeSendRequest({ request, context }) {
        if (context.req && context.req.headers) {
            // pass all headers to subgraph
            Object.keys(context.req.headers || []).forEach(key => {
                if (context.req.headers[key]) {
                    request.http.headers.set(key, context.req.headers[key]);
                }
            });
        }
    }
  }
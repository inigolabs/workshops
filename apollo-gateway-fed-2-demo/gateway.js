const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway } = require("@apollo/gateway");
const { Inigo, InigoRemoteDataSource, InigoSchemaManager } = require("inigo.js");

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

const inigo = new Inigo();

const gateway = new ApolloGateway({
    supergraphSdl: new InigoSchemaManager({
        endpoint: "https://staging.inigo.io/agent/query", //INIGO_REGISTRY_URL,
        //onInitError: readInitialSchemaFromFile,
    }),
    buildService(service) {
        return new CustomRemoteDataSource(service, inigo);
    }
});

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
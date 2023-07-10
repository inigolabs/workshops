const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
// INIGO: Uncomment below:
// const { InigoPlugin, InigoRemoteDataSource, InigoFetchGatewayInfo } = require("inigo.js");

const supergraphSdl = new IntrospectAndCompose({
  subgraphs: [
    { name: "accounts", url: "http://localhost:4001/graphql" },
    { name: "reviews", url: "http://localhost:4002/graphql" },
    { name: "products", url: "http://localhost:4003/graphql" },
    { name: "inventory", url: "http://localhost:4004/graphql" },
  ],
});

// INIGO: use InigoRemoteDataSource instead of RemoteGraphQLDataSource.
// class CustomRemoteDataSource extends InigoRemoteDataSource {
//   async onBeforeSendRequest({ request, context }) {
//     if (context.req && context.req.headers) {
//       // pass all headers to subgraphs
//       Object.keys(context.headers || []).forEach((key) => {
//         if (context.headers[key]) {
//           request.http.headers.set(key, context.headers[key]);
//         }
//       });
//     }
//   }
//   async onAfterReceiveResponse({ request, response, context }) {
//     return response;
//   }
// }

(async () => {

  // INIGO: InigoPlugin must be instantiated before ApolloGateway is started
  // const inigoPlugin = InigoPlugin();

  // INIGO: execute InigoFetchGatewayInfo() and use the result as a param for your custom data source
  // const info = await InigoFetchGatewayInfo();

  const gateway = new ApolloGateway({
    supergraphSdl,
    __exposeQueryPlanExperimental: true,
    // INIGO:
    // buildService(service) {
    //   return new CustomRemoteDataSource(service, info, true); 
    // },
  });

  const server = new ApolloServer({
    gateway,
    engine: false,
    subscriptions: false,
    // INIGO:
    // plugins: [
    //   inigoPlugin,
    // ],
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
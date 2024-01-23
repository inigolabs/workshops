const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { GraphQLError } = require('graphql');
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { parse } = require('graphql');

var cwd = resolve(__dirname, ".");
var typeDefs = parse(readFileSync(resolve(cwd, "schema.graphql"), "utf-8"));
var count = 0;

const resolvers = {
  Product: {
    __resolveReference(object) {
      count++
      if(count % 7 == 0) {
        throw new GraphQLError('Darn! Something went very wrong!');
      }
      else if (count % 5 == 0) {
        var waitTill = new Date(new Date().getTime() + 1000);
        while(waitTill > new Date()){}
      }
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: 4003 },
}).then(({ url }) => console.log(`🚀  Products subgraph ready at ${url}`));

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50
  }
];

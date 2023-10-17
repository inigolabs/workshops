const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { parse } = require('graphql');

var cwd = resolve(__dirname, ".");
var typeDefs = parse(readFileSync(resolve(cwd, "schema.graphql"), "utf-8"));

const resolvers = {
  Product: {
    __resolveReference(object) {
      return {
        ...object,
        ...inventory.find(product => product.upc === object.upc)
      };
    },
    shippingEstimate(object) {
      // free for expensive items
      if (object.price > 1000) return 0;
      // estimate is based on weight
      return object.weight * 0.5;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4004 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const inventory = [
  { upc: "1", inStock: true },
  { upc: "2", inStock: false },
  { upc: "3", inStock: true }
];

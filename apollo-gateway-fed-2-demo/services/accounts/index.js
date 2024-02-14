const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { parse } = require('graphql');
const { GraphQLError } = require('graphql');

var cwd = resolve(__dirname, ".");
var typeDefs = parse(readFileSync(resolve(cwd, "schema.graphql"), "utf-8"));

var myId = 0;

const resolvers = {
  Query: {
    me() {
      return users[myId];
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => console.log(`🚀  Accounts subgraph ready at ${url}`));

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  },
  {
    id: "3",
    name: "Eric Murphy",
    birthDate: "1979-04-01",
    username: "@murphye"
  }
];

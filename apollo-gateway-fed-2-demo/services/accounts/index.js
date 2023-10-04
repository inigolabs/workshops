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
  Query: {
    me() {
      count++
      if(count % 7 == 0) {
        throw new GraphQLError('Darn! Something went very wrong!');
      }
      else if (count % 5 == 0) {
        var waitTill = new Date(new Date().getTime() + 1000);
        while(waitTill > new Date()){}
      }
      return users[0];
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
  }
];

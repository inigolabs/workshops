const { ApolloServer, gql, ApolloError } = require("apollo-server");
const { readFileSync } = require("fs");
const { Token } = require("graphql");
const { InigoPlugin } = require("inigo.js")
require("fs")
require("dotenv").config()

const typeDefs = readFileSync(require.resolve('./graphql/schema.graphql')).toString('utf-8')

var count = 0;

const resolvers = {
  Query: {
    me() {
      count++
      if(count % 7 == 0) {
        throw new ApolloError('Darn! Something went very wrong!');
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
  typeDefs,
  resolvers,
  plugins: [
    InigoPlugin()
  ]
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

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

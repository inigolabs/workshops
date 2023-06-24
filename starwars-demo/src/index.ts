import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// import { InigoPlugin } from "inigo.js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "yaml";
import * as fileUrl from "url";
import resolvers from "./resolvers.js"

const __dirname = fileUrl.fileURLToPath(new URL(".", import.meta.url));
const cwd = resolve(__dirname, "..");

const typeDefs = readFileSync(resolve(cwd, "data/schema.graphql"), "utf-8");
const data = parse(readFileSync(resolve(cwd, "data/starwars_data.yaml"), "utf-8"));

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers(data),
  plugins: [
    // InigoPlugin()
  ]
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});


console.log(`🚀  Server ready at: ${url}`);
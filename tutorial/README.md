# Inigo Tutorial

This tutorial demonstrates the core capabilities of the [Inigo](https://inigo.io) GraphQL platform. For this tutorial, Apollo Server is used, but you can optionally use [another supported GraphQL Server](https://docs.inigo.io/deployment/).

This tutorial includes a *Star Wars* GraphQL schema with sample data. The Apollo server can be run with:

```shell
npm start
```

You will then be able to access Apollo Studio at http://localhost:4000

## Install the Inigo Agent

Inigo requires the installation of an agent that securely calls back to the Inigo's control plane. This agent runs as a middleware that intercepts GraphQL queries and forwards relevant data to Inigo.

For Inigo to work, the following steps must be completed:


### 1. Install the `inigo.js` Package

```shell
npm install inigo.js
```

### 2. Install the `inigo` Agent Package:

Pick from the following options:

#### Linux Intel or AMD
```shell
npm install inigo-linux-amd64
```
#### Linux ARM
```shell
npm install inigo-linux-arm64
```

#### Mac Intel
```shell
npm install inigo-darwin-amd64
```
#### Mac M1 or M2
```shell
npm install inigo-darwin-arm64
```

#### Windows Intel or AMD
```shell
npm install inigo-windows-amd64
```

### 3. Add the `InigoPlugin` for Apollo Server to `index.ts`

Add to the `import` section:
```ts
import { InigoPlugin } from "inigo.js";
```

Add to the `plugins`:
```ts
const server = new ApolloServer({
  //...
  plugins: [
    InigoPlugin()
  ]
  //...
});
```

### 4. Start Apollo Server Using Your Inigo Token

```shell
INIGO_SERVICE_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..." npm start
```
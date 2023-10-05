# Apollo Gateway + Apollo Federation 2.x + Inigo Demo

## Apollo Gateway Demo Application Setup

This demo showcases four subgraph schemas running as federated GraphQL microservices. Inigo will be added to provide anaytics and management of the federated graph.

### Run NPM Install

```
cd apollo-gateway-fed-2-demo
npm install
```


### Install the NPM Modules for Inigo

Pick one of the following, depending on your OS and CPU:
```
npm install inigo-linux-amd64
npm install inigo-linux-arm64
npm install inigo-darwin-amd64
npm install inigo-darwin-arm64
npm install inigo-windows-amd64
npm install inigo-darwin-arm64
```

### Run Demo Microservices

This will install all of the dependencies for the gateway and each underlying service.

```sh
npm run start-services
```

This command will run all of the microservices at once. They can be found at http://localhost:4001, http://localhost:4002, http://localhost:4003, and http://localhost:4004.


## Inigo Setup

### Install the CLI

```shell
brew tap inigolabs/homebrew-tap
brew install inigo_cli
```

or if already installed, upgrade to at minimum >=0.28.1:

```
brew upgrade inigo_cli
```

### Login to Inigo via the CLI

```shell
inigo login (google or github)
```

### Setup the Inigo `Service` and get a  token

You must use the Inigo CLI to create a `Service` and apply a `Gateway` configuration to set up this demo.

```shell
inigo create service apollo-gateway-fed-2-demo:dev
inigo create token apollo-gateway-fed-2-demo:dev
```

Copy the token. **Keep the token handy!** You will need it when deploying Apollo Gateway with Inigo.

### Apply the Inigo `Gateway`

```shell
inigo apply inigo/gateway.yaml
```

The `gateway.yaml` configuration sets up the subgraph services and looks like this:

```yaml
kind: Gateway
name: apollo-gateway-fed-2-demo
label: dev
spec:
  composition: ApolloFederation_v2
  services:
    - name: accounts
      url: "http://localhost:4001/graphql"
      schema_files:
      - ../services/accounts/schema.graphql
    - name: reviews
      url: "http://localhost:4002/graphql"
      schema_files:
      - ../services/reviews/schema.graphql
    - name: products
      url: "http://localhost:4003/graphql"
      schema_files:
      - ../services/products/schema.graphql
    - name: inventory
      url: "http://localhost:4004/graphql"
      schema_files:
      - ../services/inventory/schema.graphql
```

Now when you run `inigo get service` you should see `apollo-gateway-fed-2-demo:dev` with its subgraph services, but they will not yet be running:

```shell
inigo get service
NAME                       LABEL     INSTANCES  STATUS
----                       -----     ---------  ------
apollo-gateway-fed-2-demo  dev       0          Not Running
- accounts                 dev       0          Not Running
- reviews                  dev       0          Not Running
- products                 dev       0          Not Running
- inventory                dev       0          Not Running
```

## Inigo Setup for Apollo Federation Local Composition

### Setup the `.env` for Local Composition

Copy the `.env.sample` to `.env` and add your `INIGO_SERVICE_TOKEN`. 

You can leave the `LOCAL_COMPOSED_SCHEMA=supergraph.graphql` for now unless you want a different file name.

## Run the Local Composition to Generate the Federated Schema

```shell
inigo compose ./inigo/gateway.yaml > supergraph.graphql
```

### Start the Apollo Gateway

```sh
npm run start-gateway
```

> You will see additional logging statements coming from Inigo via the Apollo Gateway. You can ignore these logs unless some problem occurs.

Optionally, you can check the service again to see that it's `Running`.

```sh                     
inigo get service
NAME                       LABEL     INSTANCES  STATUS
----                       -----     ---------  ------
apollo-gateway-fed-2-demo  dev       1          Not Running
- accounts                 dev       1          Not Running
- reviews                  dev       1          Not Running
- products                 dev       1          Not Running
- inventory                dev       1          Not Running
```

Go to the Apollo Sandbox at http://localhost:4000

Run the `my_reviewed_products_to_buy_again_local` query. This query runs against all 4 GraphQL microservices.

> Note: This query will not be seen in Analytics due to the setup for the locally composed schema.

```graphql
query my_reviewed_products_to_buy_again_local {
  me {
    name
    reviews {
      product {
        name
        price
        shippingEstimate
        inStock
      }
      review: body
    }
  }
}
```



# Clean Up

Shut down the Apollo Gateway to disconnect the agent. You must wait about 10 minutes to no longer be in a `Running` state before you can `delete`.

```shell
inigo delete service apollo-gateway-fed-2-demo:dev
inigo delete service accounts:dev
inigo delete service reviews:dev
inigo delete service products:dev
inigo delete service inventory:dev
```
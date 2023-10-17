# Apollo Router + Apollo Federation 1.x + Inigo Demo

You may jump ahead [Inigo Setup](inigo-setup) if you already have this project running and already know how Apollo Gateway works.

> This demo currently uses Apollo Server v3 which is deprecated. This demo will be updated to the latest versions in the future.

## Apollo Router Demo Application Setup

This demo showcases four partial schemas running as federated microservices. Inigo will be added to provide observability to the federated graph.

To learn more about Apollo Federation, check out the [docs](https://www.apollographql.com/docs/apollo-server/federation/introduction).

### Demo Installation

To run this demo locally, clone this Git repository to your local machine then change to the directory:

```sh
cd apollo-router-fed-1-demo
```

### Run Demo Microservices

This will install all of the dependencies for the gateway and each underlying service.

```sh
npm run start-services
```

This command will run all of the microservices at once. They can be found at http://localhost:4001, http://localhost:4002, http://localhost:4003, and http://localhost:4004.

### Sample GraphQL Queries for Individual Services

#### Accounts Service Sample Query

Here is the GraphQL schema for Accounts:

```graphql
  extend type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
```

Go to http://localhost:4001

```graphql
query me {
  me {
    name,
    username
  }
}
```

#### Products Service Sample Query

Here is the GraphQL schema for Products:

```graphql
  extend type Query {
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }
```

Go to http://localhost:4003

```graphql
query topProducts {
  topProducts {
    name,
    price,
    weight,
    upc
  }
}
```

#### Inventory Service Federated Schema

Inventory extends `Product` with inventory information about the product. Here is the federated schema:

```graphql
  extend type Product @key(fields: "upc") {
    upc: String! @external
    weight: Int @external
    price: Int @external
    inStock: Boolean
    shippingEstimate: Int @requires(fields: "price weight")
  }
```

#### Reviews Service Federated Schema

Reviews provides the federated GraphQL schema that ties together `Review`, `User`, and `Product`.

```graphql
  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User @provides(fields: "username")
    product: Product
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    username: String @external
    reviews: [Review]
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews: [Review]
  }
```

## Inigo Setup

### Install the CLI

```shell
brew tap inigolabs/homebrew-tap
brew install inigo_cli
```

or to make sure you have the latest:

```
brew upgrade inigo_cli
```

### Login to Inigo via the CLI

```shell
inigo login google
```
or
```shell
inigo login github
```

### Setup the Inigo `Service` and `Gateway`

You must use the Inigo CLI to create a `Service` and apply a `Gateway` configuration to set up this demo.

```shell
inigo create service apollo-router-fed-1-demo
inigo create token apollo-router-fed-1-demo
```


cd apollo-gateway-router-fed-1-demo
docker run --rm  \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
-v ${PWD}/supergraph-schema.graphql:/etc/apollo/supergraph-schema.graphql \
-e APOLLO_ROUTER_SUPERGRAPH_PATH="/etc/apollo/supergraph-schema.graphql" \
--name router inigohub/inigo_apollo_router


docker run --rm  \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
--name router inigohub/inigo_apollo_router


docker run --rm  \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
-e INIGO_REGISTRY_ENABLED=true \
-e INIGO_SERVICE_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjowLCJpYXQiOjE2OTYzNjQzNzcsInN1YiI6ImFwb2xsby1yb3V0ZXItZmVkLTEtZGVtbyJ9LCJ0b2tlblR5cGUiOiJzZXJ2aWNlX3Rva2VuIiwidXNlcl9wcm9maWxlIjoic2lkZWNhciIsInVzZXJfcm9sZXMiOlsic2lkZWNhciJdLCJ1c2VyX2lkIjo1MjAsInVzZXJfbmFtZSI6IkVyaWMvYXBvbGxvLXJvdXRlci1mZWQtMS1kZW1vIiwib3JnX2lkIjoxMzUsInRva2VuIjoiNmMzZWI3MjMtYWE1ZS00NDI4LTk2ODctMmUyYjE1ZDZhOWM5IiwiZW5jcnlwdGlvbl9rZXkiOiI3VUtJdEwvTVMvRCtpcHhlcGs0MUlXS0JtNDhKcUxBVnF4alEySHg5NFlnPSJ9.Z4UiifczsVlszzviUEuJ6ulK2cHsijAJ1tpcSK56_AYXqoLmlUe7DvcKhZWCtMzA3sV3HnkGjL8Rlzx8y4QS7Q" \
-e INIGO_SERVICE_URL=https://app.inigo.io/agent/query \
--name router inigohub/inigo_apollo_router



docker run --rm  \
-e INIGO_REGISTRY_ENABLED=true \
-e INIGO_SERVICE_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjowLCJpYXQiOjE2OTYxMDA0MDksInN1YiI6ImFwb2xsby1yb3V0ZXItZmVkLTEtZGVtbyJ9LCJ0b2tlblR5cGUiOiJzZXJ2aWNlX3Rva2VuIiwidXNlcl9wcm9maWxlIjoic2lkZWNhciIsInVzZXJfcm9sZXMiOlsic2lkZWNhciJdLCJ1c2VyX2lkIjo1MjAsInVzZXJfbmFtZSI6IkVyaWMvYXBvbGxvLXJvdXRlci1mZWQtMS1kZW1vIiwib3JnX2lkIjoxMzUsInRva2VuIjoiNDJjNzVkNDktMWJiNi00YWFkLWFjMGUtMWZmYmI1MTc3Nzg2IiwiZW5jcnlwdGlvbl9rZXkiOiI3VUtJdEwvTVMvRCtpcHhlcGs0MUlXS0JtNDhKcUxBVnF4alEySHg5NFlnPSJ9.BBIZxx1wW90kP3wDhTqKXjuQ2SgXH-cFAcZde45qGSNetbfWdHQdFp_tdnv4UxCkiiD-JDdW5cqruLUEGoReFw" \
-e INIGO_SERVICE_URL=https://app.inigo.io/agent/query \
--name router inigohub/inigo_apollo_router


docker run --rm  \
--mount "type=bind,source=/Users/inigo/Documents/GitHub/workshops/apollo-router-fed-1-demo/router.yaml,target=/dist/config/router.yaml" \
--name router inigohub/inigo_apollo_router


Works:
docker run --rm -p 4000:4000 \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
-e APOLLO_ROUTER_CONFIG_PATH=/dist/config/router.yaml \
-e APOLLO_ROUTER_LOG=debug \
-e INIGO_REGISTRY_ENABLED=true \
-e INIGO_SERVICE_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjowLCJpYXQiOjE2OTYxMDA0MDksInN1YiI6ImFwb2xsby1yb3V0ZXItZmVkLTEtZGVtbyJ9LCJ0b2tlblR5cGUiOiJzZXJ2aWNlX3Rva2VuIiwidXNlcl9wcm9maWxlIjoic2lkZWNhciIsInVzZXJfcm9sZXMiOlsic2lkZWNhciJdLCJ1c2VyX2lkIjo1MjAsInVzZXJfbmFtZSI6IkVyaWMvYXBvbGxvLXJvdXRlci1mZWQtMS1kZW1vIiwib3JnX2lkIjoxMzUsInRva2VuIjoiNDJjNzVkNDktMWJiNi00YWFkLWFjMGUtMWZmYmI1MTc3Nzg2IiwiZW5jcnlwdGlvbl9rZXkiOiI3VUtJdEwvTVMvRCtpcHhlcGs0MUlXS0JtNDhKcUxBVnF4alEySHg5NFlnPSJ9.BBIZxx1wW90kP3wDhTqKXjuQ2SgXH-cFAcZde45qGSNetbfWdHQdFp_tdnv4UxCkiiD-JDdW5cqruLUEGoReFw" \
-e INIGO_SERVICE_URL=https://app.inigo.io/agent/query \
--name router inigohub/inigo_apollo_router



docker run --rm -p 4000:4000 \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
-e APOLLO_ROUTER_CONFIG_PATH=/dist/config/router.yaml \
-e INIGO_REGISTRY_ENABLED=true \
-e INIGO_SERVICE_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjowLCJpYXQiOjE2OTYxMDA0MDksInN1YiI6ImFwb2xsby1yb3V0ZXItZmVkLTEtZGVtbyJ9LCJ0b2tlblR5cGUiOiJzZXJ2aWNlX3Rva2VuIiwidXNlcl9wcm9maWxlIjoic2lkZWNhciIsInVzZXJfcm9sZXMiOlsic2lkZWNhciJdLCJ1c2VyX2lkIjo1MjAsInVzZXJfbmFtZSI6IkVyaWMvYXBvbGxvLXJvdXRlci1mZWQtMS1kZW1vIiwib3JnX2lkIjoxMzUsInRva2VuIjoiNDJjNzVkNDktMWJiNi00YWFkLWFjMGUtMWZmYmI1MTc3Nzg2IiwiZW5jcnlwdGlvbl9rZXkiOiI3VUtJdEwvTVMvRCtpcHhlcGs0MUlXS0JtNDhKcUxBVnF4alEySHg5NFlnPSJ9.BBIZxx1wW90kP3wDhTqKXjuQ2SgXH-cFAcZde45qGSNetbfWdHQdFp_tdnv4UxCkiiD-JDdW5cqruLUEGoReFw" \
-e INIGO_SERVICE_URL=https://app.inigo.io/agent/query \
--name router inigohub/inigo_apollo_router


docker run --rm -p 4000:4000 \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
-e APOLLO_ROUTER_CONFIG_PATH=/dist/config/router.yaml \
-e INIGO_REGISTRY_ENABLED=true \
-e INIGO_SERVICE_TOKEN="ey..." \
-e INIGO_SERVICE_URL=https://app.inigo.io/agent/query \
--name router inigohub/inigo_apollo_router




docker run --rm -p 4000:4000 \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
-e APOLLO_ROUTER_CONFIG_PATH=/dist/config/router.yaml \
-e INIGO_REGISTRY_ENABLED=true \
-e INIGO_SERVICE_URL=https://app.inigo.io/agent/query \
--name router inigohub/inigo_apollo_router




inigo check inigo/gateway.yml
inigo apply inigo/gateway.yml
inigo publish apollo-router-fed-1-demo




















query='query my_reviewed_products_to_buy_again {
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
}'
variables='{}'
curl -i -X POST http://127.0.0.1:4000 \
  -H 'Host: apollo-router.local' \
  -H 'Content-Type: application/json' \
  -d @- <<EOF
      {"query": "$(echo $query)", "variables": $variables}
EOF








sandbox:
  enabled: true
supergraph:
  introspection: true
homepage:
  enabled: false
include_subgraph_errors:
  all: true
headers:
  all:
    request:
      - propagate:
          matching: .*
cors:
  allow_any_origin: true
  origins: []
plugins:
  inigo.middleware:
    jwt_header: "authorization"
    service: "http://localhost:30018/query"
    token: "eyJhbGciOiJIUzUxMiIsInR5cCI6Ikp


docker run --rm  \
-v $(pwd)/router.yaml:/dist/config/router.yaml \
-v $(pwd)/supergraph-schema.graphql:/etc/apollo/supergraph-schema.graphql \
-e APOLLO_ROUTER_SUPERGRAPH_PATH="/etc/apollo/supergraph-schema.graphql" \
--name router -it inigohub/inigo_apollo_router sh


docker run -it --entrypoint /bin/ls inigohub/inigo_apollo_router



docker run --rm  \
-v $(pwd)/router.yaml:/dist/config/router.yaml \
--name router inigohub/inigo_apollo_router



--mount "type=bind,source=/Users/inigo/Documents/GitHub/workshops/apollo-router-fed-1-demo/router.yaml,target=/dist/config/router.yaml"  --rm 



Keep the token handy! You will need it when deploying Apollo Gateway with Inigo.

```shell
inigo apply inigo/gateway.yml
```

The `gateway.yaml` configuration sets up the subgraph services and looks like this:

```yaml
kind: Gateway
name: apollo-gateway-demo
spec:
  services:
    - name: accounts
      url: "http://localhost:4001/graphql"
    - name: reviews
      url: "http://localhost:4002/graphql"
    - name: products
      url: "http://localhost:4003/graphql"
    - name: inventory
      url: "http://localhost:4004/graphql"
```

Now when you run `inigo get service` you should see `apollo-gateway-demo` with its subgraph services:

```shell
inigo get service
NAME                 LABEL      INSTANCES  STATUS
----                 -----      ---------  ------
apollo-gateway-demo             0          Not Running
- accounts                      0          Not Running
- reviews                       0          Not Running
- products                      0          Not Running
- inventory                     0          Not Running
```

Now Inigo is prepared for your subgraphs!

## Apollo Gateway Setup

### Install the NPM Modules for Inigo

```
npm install inigo.js
```
Pick one of the following, depending on your OS and CPU:
```
npm install inigo-linux-amd64
npm install inigo-linux-arm64
npm install inigo-darwin-amd64
npm install inigo-darwin-arm64
npm install inigo-windows-amd64
npm install inigo-darwin-arm64
```

### Make the Code Changes for the Inigo Agent

Open `gateway.js` in your favorite JavaScript editor. In the file, you will see, for your convenience, comment blocks of code that are necessary to setup Inigo. 

You must uncomment every block of code under each `//INIGO:` comment, for example:

```js
// INIGO: Uncomment below:
const { InigoPlugin, InigoRemoteDataSource, InigoFetchGatewayInfo } = require("inigo.js");
```

When you uncomment these lines of code, notice what the purpose is of each. When they are all uncommented, you will be able to run Apollo Gateway with the Inigo agent installed and configured for it.

### Restart the Apollo Gateway

Now that Inigo is installed, in the terminal currently running the Apollo Gateway, `CTRL+C` to stop it.

### Run the Gateway with `INIGO_SERVICE_TOKEN`

```sh
export INIGO_SERVICE_TOKEN="ey..."
npm run start-gateway
```

> You will see additional logging statements coming from Inigo via the Apollo Gateway. You can ignore these logs unless some problem occurs.

Optionally, you can check the service again to see that it's `Running`.

```sh
inigo get service                       
NAME                 LABEL      INSTANCES  STATUS
----                 -----      ---------  ------
apollo-gateway-demo             1          Running
- accounts                      1          Running
- reviews                       1          Running
- products                      1          Running
- inventory                     1          Running
```

Go to the Apollo Sandbox again at http://localhost:4000


Run the `my_reviewed_products_to_buy_again` query again to hit all 4 GraphQL microservices. The data from this federated query execution will now be forwarded to Inigo!

```graphql
query my_reviewed_products_to_buy_again {
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

Now run the query several times to send additional data to Inigo.

> Note: It wll likely take a moment or two for the data to show up in Inigo. Please be patient!

### Viewing the Results in Inigo

In https://app.inigo.io you will be able to view the federated GraphQL query that you run, the subgraph GraphQL queries, and Inigo Analytics independently for each of them.

Here are screenshots showing the specific outputs for the federated GraphQL query. The red boxes show the menu where the Services are selected. This will help you navigate to the correct location in Inigo.

![](images/apollo-gateway-demo-query.png)

![](images/accounts-query.png)

![](images/products-query.png)

![](images/inventory-query.png)

![](images/reviews-query.png)

In each Service and subgraph Service, you can explore each of the queries independently to learn about their performance and utilization attributes.

# Clean Up

Shut down the Apollo Gateway to disconnect the agent. Wait 10 minutes.

```shell
inigo delete service apollo-gateway-demo
inigo delete service accounts
inigo delete service reviews
inigo delete service products
inigo delete service inventory
```

This process will be simplified in an upcoming release of Inigo.
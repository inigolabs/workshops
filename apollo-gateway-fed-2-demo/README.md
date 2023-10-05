# Apollo Gateway + Apollo Federation 2.x + Inigo Demo

## Part A: Apollo Gateway Demo Application Setup

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

### Run Demo GraphQL Subgraph Microservices

This command will run all of the GraphQL Subgraph microservices at once:

```sh
npm run start-services
```

They will be running at http://localhost:4001, http://localhost:4002, http://localhost:4003, and http://localhost:4004.

## Part B: Inigo Setup

Open a new terminal (to keep the GraphQL subgraph services running) and `cd` back into this project directory.

```
cd apollo-gateway-fed-2-demo
```

### Install the Inigo CLI (If Not Installed)

```shell
brew tap inigolabs/homebrew-tap
brew install inigo_cli
```

or if already installed, upgrade to at minimum version 0.28.1:

```
brew upgrade inigo_cli
```

### Login to Inigo via the CLI

```shell
inigo login (google or github)
```

### Setup the Inigo `Service` and get a  token

You can use the Inigo CLI to create a `Service` and apply a `Gateway` configuration to set up this demo. This could also be done through the UI.

```shell
inigo create service apollo-gateway-fed-2-demo:dev
inigo create token apollo-gateway-fed-2-demo:dev
```

Copy the token, which will look like `eyJhbGciOiJIUzU...`. **Keep the token handy!** You will need it when deploying Apollo Gateway with Inigo.

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

## Part C: Inigo Setup for Apollo Federation Local Composition

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

> Note: You will see logging statements coming from the Inigo sidecar while running the Apollo Gateway. You can ignore these logs unless some problem occurs.

Go to the Apollo Sandbox at http://localhost:4000 or configure the Inigo Explorer to call http://localhost:4000.

Run the `my_reviewed_products_to_buy_again_local` query. This query runs against all 4 GraphQL microservices.

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

After you run the query several times and then go to Inigo Analytics, you will be able to see analytics data for `my_reviewed_products_to_buy_again_local`.

![](images/local-query-analytics.png)

## Part D: Inigo Setup for Apollo Federation Schema Registry

### Publishing a Schema for the First Time

The next step, after running with a locally composed schema, is to publish your schema to the Inigo schema registry. This can be done with the following command:

```shell
inigo publish apollo-gateway-fed-2-demo:dev
```

Here is the expected output for the first time you publish a schema:

```
apollo-gateway-fed-2-demo % inigo publish apollo-gateway-fed-2-demo:dev
Schema v1 published successfully!
```

On the Inigo UI you can see the pubish result under `Config` -> `Activity`.

![](images/schema-first-publish.png)


### Introduce a Breaking Schema Change

1. Remove `inStock: Boolean` from the `apollo-gateway-fed-2-demo/services/inventory/schema.graphql` schema file.
2. Run the check command:
```shell
inigo check inigo/gateway.yaml
```
The expected output will be:
```
apollo-gateway-fed-2-demo % inigo check inigo/gateway.yaml
Service: apollo-gateway-fed-2-demo:dev

Changelog:
----------
gateway/services/inventory/schema_files  updated  

Steps:
------
Validation:   passed
Composition:  passed
Operational:  failed
Evaluation:   omitted

Detected 1 breaking change(s), 0 non-breaking change(s).
New schema is validated against traffic from Tue, 05 Sep 2023 13:55:19 PDT.

Schema changes:
---------------
BREAKING: Field Product.inStock was removed.
  Location: composed:26:2
    -   inStock: Boolean
  Usage
  no usage


Execute the below command to ignore this failure on the next run:
>  inigo bypass check 1a8e3e373fb394bc128656dd8c37a9836b84c5c2

Check out the report in the UI:
https://app.inigo.io/548/config/activity/2876

error: check failed, see report above for details
```

On the Inigo UI you can see the breaking change result under `Config` -> `Activity`.

![](images/schema-breaking-change.png)


### Override and Publish a Breaking Change
If you are confident that your breaking change will not impact your clients and you would like to override and publish, this is possible by running the following commands:

1. Run the apply command for the gateway:
```shell
inigo apply inigo/gateway.yaml
```
The expected output of the command will be:
```
apollo-gateway-fed-2-demo % inigo apply inigo/gateway.yaml
Service: apollo-gateway-fed-2-demo:dev

Changelog:
----------
gateway/services/inventory/schema_files  updated  

Steps:
------
Validation:   passed
Composition:  passed
Operational:  failed
Evaluation:   omitted

Detected 1 breaking change(s), 0 non-breaking change(s).
New schema is validated against traffic from Tue, 05 Sep 2023 14:01:32 PDT.

Schema changes:
---------------
BREAKING: Field Product.inStock was removed.
  Location: composed:26:2
    -   inStock: Boolean
  Usage
  no usage


Execute the below command to ignore this failure on the next run:
>  inigo bypass apply 1a8e3e373fb394bc128656dd8c37a9836b84c5c2

Check out the report in the UI:
https://app.inigo.io/548/config/activity/2878

error: check failed, see report above for details
```

2. Run the apply commands to overide:
```shell
inigo bypass apply 1a8e3e373fb394bc128656dd8c37a9836b84c5c2
inigo apply inigo/gateway.yaml
```
The expected output of the commands will be:
```
inigo bypass apply 1a8e3e373fb394bc128656dd8c37a9836b84c5c2
inigo apply inigo/gateway.yaml
Feel free to re-run 'apply' of the same config again!
Service: apollo-gateway-fed-2-demo:dev

Changelog:
----------
gateway/services/inventory/schema_files  updated  

Steps:
------
Validation:   passed
Composition:  passed
Operational:  bypassed
Evaluation:   passed

Detected 1 breaking change(s), 0 non-breaking change(s).
New schema is validated against traffic from Tue, 05 Sep 2023 14:03:33 PDT.

Schema changes:
---------------
BREAKING: Field Product.inStock was removed.
  Location: composed:26:2
    -   inStock: Boolean
  Usage
  no usage

New config version 2 is applied 🎉

Check out the report in the UI:
https://app.inigo.io/548/config/activity/2879
```
On the Inigo UI you can see that schema version 2 was applied and that the `Operational` check was bypassed.

![](images/schema-version-2-breaking.png)






## Clean Up

Shut down the Apollo Gateway to disconnect the agent. You must wait about 10 minutes to no longer be in a `Running` state before you can `delete`.

```shell
inigo delete service apollo-gateway-fed-2-demo:dev
inigo delete service accounts:dev
inigo delete service reviews:dev
inigo delete service products:dev
inigo delete service inventory:dev
```
# Webinar Demo Steps

## Demo Preparation

Open `apollo-router-fed-2-demo` in VS code and open 3 console tabs.

Run:
```sh
inigo create service apollo-router-fed-2-demo:local
inigo create token apollo-router-fed-2-demo:local
```

Configure the `router.yaml` with the token value from `create token`.

Set the `$INIGO_SERVICE_TOKEN` variable in the terminal where Router will be started.

```
export INIGO_SERVICE_TOKEN=ey...
echo $INIGO_SERVICE_TOKEN
```

Create the Inigo `Gateway` and `Subgraph`s. Run these commands one at a time:

```sh
inigo apply inigo/gateway.yaml --label local
inigo apply services/products/subgraph.yaml --label local
inigo apply services/accounts/subgraph.yaml --label local
inigo apply services/inventory/subgraph.yaml --label local
inigo apply services/reviews/subgraph.yaml --label local
```

## Before the Demo

1. Be able to easily switch between VS Code and the Web Browser
2. Start with nothing open in VS Code, other than the 3 console tabs
3. Have browser tabs open for
    * Slides
    * https://app.inigo.io
    * https://docs.inigo.io/product/schema_management/checks
    * https://docs.inigo.io/reference/configuration/checks#available-linter-rules
4. Have 2nd VS Code window open showing this Markdown file
5. `inigo login google`
6. Revert `services/inventory/subgraph.yaml`
7. Revert `services/accounts/subgraph.yaml`
8. Clear the terminals
9. Make sure Docker is running

## Begin Demo

## 1. Start the Subgraph Services

```sh
npm run start-services
```

Explain that there are 4 subgraph services. These are using Apollo Server but could be any GraphQL server.

## 2. Apollo Router with Inigo Plugin

1. Explain that Router with Inigo plugin is distributed as a docker image.
2. Show the Router configuration `apollo-router-fed-2-demo/router.yaml`
3. Config is pre-populated with the token value for the demo
4. `$INIGO_SERVICE_TOKEN` has been set with the correct token value
5. Run the Router using Docker:

```sh
echo $INIGO_SERVICE_TOKEN

docker run --rm -p 4000:8080  \
-v ${PWD}/router.yaml:/dist/config/router.yaml \
-e APOLLO_ROUTER_CONFIG_PATH=/dist/config/router.yaml \
-e INIGO_SERVICE_TOKEN=$INIGO_SERVICE_TOKEN \
--name router-local inigohub/inigo_apollo_router:latest
```

There will be logging statements from the Inigo agent.

## 3. Inigo UI

1. Show the `apollo-router-fed-2-demo:local` service via the Inigo UI
2. Show the associated subgraphs for the Service

## 4. Inigo Explorer for GraphQL IDE

1. Go to the Explorer for `apollo-router-fed-2-demo:local`
2. Build a basic `me` query using Explorer
3. Run the basic query
4. Paste in the sample query

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

5. Run the sample query multiple times
6. Show the errors that were randomly generated along with the random delays
7. Give a quick tour of Explorer's features
    * History
    * Query Collections
    * Mention the webinar about Explorer to find out more

## 5. Tour of Observe

1. In a new browser tab, go to the **Observe** view in Inigo
2. Show the Date setting
3. Show Filters and filter to Errors
4. Show the Group By
5. Show the Timeline
6. Show the Tree, Heatmap, and Coverage

## 6. Subgraph Tracing

1. Show the `my_reviewed_products_to_buy_again` queries
2. Click on a query that has an error to show the query details
3. Show the subgraph tracing

## 7. Tour of Schema View 

1. Show the `Product` type for the supergraph
2. Show the associated subgraphs' `Product` type
3. Mention that Inigo does the composition in the cloud, but can also be done locally
3. Mention the Schema Diff view, but we'll come back to it later

## 8. Schema Checks with Bypass

1. Remove `inStock: Boolean` from the `apollo-gateway-fed-2-demo/services/inventory/schema.graphql` schema file.
2. Run the check command: `inigo check services/inventory/subgraph.yaml --label local`
3. Check will fail with a breaking change
    * What is a breaking change? Explain
    * Steps that Inigo runs for performing a check
    * Show the docs page https://docs.inigo.io/product/schema_management/checks
4. Go to **Activity** in the UI
5. Show the failed check that was run
6. Bypass the next run (we want to remove `inStock`) from the UI
7. Run the check command: `inigo apply services/inventory/subgraph.yaml --label local`
8. New composed schema is automatically published
9. Show the **Activity** in the UI again
10. Show that the Apply Passed
11. Go to the **Schema** view and show the diff
12. Go to **Explorer** and show that `inStock` needs to be removed from the query to successfully run

## 9. Checks Config for Linting 

1. Show the config under `apollo-router-fed-2-demo/inigo/checks.yaml`

```yaml
kind: Checks
name: apollo-router-fed-2-demo
spec:
  steps:
    linting:
      fail_on: error
      disable: false
      schema_lint_rules:
        - level: error
          name: FIELD_NAMES_CAMEL_CASE
        - level: warning
          name: REST_FIELD_NAMES
```

2. Show the doc with available Linter rules https://docs.inigo.io/reference/configuration/checks#available-linter-rules
3. Open in editor the schema `apollo-router-fed-2-demo/services/accounts/schema.graphql`
4. Add `NICKNAME` field to `User` as such:

```gql
type User @key(fields: "id") {
    id: ID!
    name: String
    NICKNAME: String
    username: String @shareable
}
```
5. Run `inigo check services/accounts/subgraph.yaml --label local`
6. Show the Linting failure in the logs
7. Show the Linting failure in **Activity**
8. Add `@lint` to ignore as such (note `@lint` definition already exists):

```gql
type User @key(fields: "id") {
    id: ID!
    name: String
    NICKNAME: String @lint(ignore: ["FIELD_NAMES_CAMEL_CASE"])
    username: String @shareable
}
```

9. Run `inigo apply services/accounts/subgraph.yaml --label local`
10. There should not be any Linting errors in the output
11. Go to the **Schema** view and show the diff

## 10. Demo Complete! Return to Slides



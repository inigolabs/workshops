# Inigo's Managed Federation for Apollo Federation v2 User Guide

This guide will walk you through how to use Inigo's Managed Federation for Apollo Federation v2. Inigo offers a drop-in replacement for existing Apollo Federation (v1 or v2) implementations. Inigo includes schema composition, operational schema checks, a versioned schema registry, and more.

## Part A: Composing a Federated Schema Locally

Using the `inigo` CLI, you can locally compose your federated schema for development purposes, and then when you are ready, you can publish the federated schema to the Inigo Cloud.

### 1. Set Up a Federated Schema

You can use Inigo's `Gateway` configuration to setup your Apollo Federation v2 configuration. This configuration references your local subgraph schemas, as shown in this example:

File: `gateway.yaml`
```yaml
kind: Gateway
name: apollo-gateway-fed-2-demo
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

This configuration file is similar to Apollo's Supergraph configuration file, and it's no longer needed when using Inigo.

File: `supergraph-config.yaml`
```yaml
federation_version: 2
subgraphs:
  accounts:
    routing_url: http://localhost:4001/graphql
    schema:
      file: ./services/accounts/schema.graphql
  reviews:
    routing_url: http://localhost:4002/graphql
    schema:
      file: ./services/reviews/schema.graphql
  products:
    routing_url: http://localhost:4003/graphql
    schema:
      file: ./services/products/schema.graphql
  inventory:
    routing_url: http://localhost:4004/graphql
    schema:
      file: ./services/inventory/schema.graphql
```

### 2. Compose the Local Federated Schema

Now with the `gateway.yaml`, you are ready to compose a federated schema as such:

1. `cd apollo-gateway-fed-2-demo`
1. `inigo compose ./inigo/gateway.yaml > supergraph.graphql`

With the generated `supergraph.graphql`, you can run with a local Apollo Gateway or Apollo Router as needed.

## Part B: Publish a Federated Schema to the Inigo Cloud

1. Run `inigo apply inigo/gateway.yaml` to apply the composed schema for the first time
2. Run `inigo publish apollo-gateway-fed-2-demo` to publish the composed schema the first time


## Check for Breaking Changes and Publish a new Schema Version

For this scenario, add a new field (non-breaking change) to the schema, check for breaking changes, and then 
publish the changes for the composed schema.

1. Add `inStock: Boolean` to `apollo-gateway-fed-2-demo/services/inventory/schema.graphql`
2. Run `inigo check inigo/gateway.yaml` to check for breaking changes
3. Run `inigo apply inigo/gateway.yaml` to apply the changes for the composed schema
4. Run `inigo publish apollo-gateway-fed-2-demo` to publish the composed schema with the change

The updated schema should be published successfully. You will now be able to run a query with the `inStock` field as such:

```graphql
query my_reviewed_products_to_buy_again_instock {
  me {
    name
    reviews {
      product {
        name
        price
        weight
        inStock
        shippingEstimate
      }
      review: body
    }
  }
}
```


## Create a Breaking Change

1. Remove `inStock: Boolean` from `apollo-gateway-fed-2-demo/services/inventory/schema.graphql`
2. Run `inigo check inigo/gateway.yaml`
3. Expected output of the command will be:

```
Steps:
------
Validation:   passed
Composition:  passed
Operational:  failed
Evaluation:   omitted

Detected 1 breaking change(s), 0 non-breaking change(s).
New schema is validated against traffic from Mon, 04 Sep 2023 14:12:38 PDT.

Schema changes:
---------------
BREAKING: Field Product.inStock was removed.
  Location: composed:26:2
    -   inStock: Boolean
  Usage
  Operation (1)                      Client (1)  Calls (44)  LastCalled (Wed 04 Oct 2023 PDT)
  -------------                      ----------  ----------  --------------------------------
  my_reviewed_products_to_buy_again  unknown     44          Wed 04 Oct 2023 PDT
```

## Override and Publishing a Breaking Change
If you are confident that your breaking change will not impact your clients and you would like to override and publish, this is possible by running the following commands:

1. Run `inigo apply inigo/gateway.yaml`
2. Expected output of the command will be:
```
Detected 1 breaking change(s), 0 non-breaking change(s).
New schema is validated against traffic from Mon, 04 Sep 2023 14:17:09 PDT.

Schema changes:
---------------
BREAKING: Field Product.inStock was removed.
  Location: composed:26:2
    -   inStock: Boolean
  Usage
  Operation (1)                      Client (1)  Calls (44)  LastCalled (Wed 04 Oct 2023 PDT)
  -------------                      ----------  ----------  --------------------------------
  my_reviewed_products_to_buy_again  unknown     44          Wed 04 Oct 2023 PDT


Execute the below command to ignore this failure on the next run:
>  inigo bypass apply a744b33833edff5450cd0bd3887e03b4b6d0a003
```
3. Run `inigo bypass apply a744b33833edff5450cd0bd3887e03b4b6d0a003`
4. Run `inigo apply inigo/gateway.yaml` again
5. Expected output of the command will be:
```
Detected 1 breaking change(s), 0 non-breaking change(s).
New schema is validated against traffic from Mon, 04 Sep 2023 14:19:55 PDT.

Schema changes:
---------------
BREAKING: Field Product.inStock was removed.
  Location: composed:26:2
    -   inStock: Boolean
  Usage
  Operation (1)                      Client (1)  Calls (44)  LastCalled (Wed 04 Oct 2023 PDT)
  -------------                      ----------  ----------  --------------------------------
  my_reviewed_products_to_buy_again  unknown     44          Wed 04 Oct 2023 PDT

New config version 4 is applied 🎉
```
6. Run `inigo publish apollo-gateway-fed-2-demo` to publish the composed schema
7. Run the sample query again to demonstrate the field was removed:
```graphql
query my_reviewed_products_to_buy_again_breaking {
  me {
    name
    reviews {
      product {
        name
        price
        weight
        inStock
        shippingEstimate
      }
      review: body
    }
  }
}
```
8. Expected output of the query will be:
```graphql
{
  "errors": [
    {
      "message": "Cannot query field \"inStock\" on type \"Product\".",
      "locations": [
        {
          "line": 9,
          "column": 9
        }
      ],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```
The `inStock` field has been removed from the published schema, and the error is expected.

## Publishing a Breaking Change with No Checks (Not Recommended)

If, for some reason, you wish you publish your schema without running checks, this is also possible. 

1. Remove `inStock` from `apollo-gateway-fed-2-demo/services/inventory/schema.graphql`
2. Run `inigo apply inigo/gateway.yaml --bypass-operational-check` to skip the operation check on the next apply
3. Run `inigo apply inigo/gateway.yaml` to apply the changes for the composed schema
4. Run `inigo publish apollo-gateway-fed-2-demo` to publish the composed schema with the breaking change

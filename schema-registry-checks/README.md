# Inigo Schema Registry and Checks

This project will demonstrate how to use Inigo's Schema Registry and Schema Checks. Apollo Server is used for demonstration purposes.

## Install the Inigo Agent Package

Install one of the agent packages, depending on your operating system and CPU type. `darwin` is for macOS and `arm64` would be for Mac M1/M2 CPUs.

```shell
npm install inigo-darwin-amd64
```

```shell
npm install inigo-darwin-arm64
```

```shell
npm install inigo-windows-amd64
```

```shell
npm install inigo-linux-amd64
```

```shell
npm install inigo-linux-arm64
```

## Login to Inigo

Login to Inigo via the `inigo` [CLI](https://docs.inigo.io/cli/installation). The options are separated by the `||`. For username/password, just run `inigo login`.

```shell
inigo login || google || github
```

Also, open your web browser to [app.inigo.io](https://app.inigo.io) so you can see the Inigo dashboard.

## Create the Inigo Service

```shell
inigo apply -f inigo/service.yml
```

The `schema-demo` Service will also now visible on [app.inigo.io](https://app.inigo.io).

## Get the Inigo Service Token and Add to `.env`

```shell
inigo create token schema-demo
```

Copy the token value and place it in the `.env` file. This token will automatically be read by the Inigo middleware
due to the use of the `dotenv` library in this demo application

## Start the Node.js Service

```
npm start
```

You will see logs (in JSON format) coming from the Inigo middleware, and you can ignore them.

## Check the Schema

```shell
inigo check inigo/service.yml
```

Here is the expected output:

```
Service: schema-demo

Changelog:
----------
service/schema_files  updated  

Steps:
------
Validation:   passed
Composition:  omitted
Operational:  passed
Evaluation:   passed

Check out the report in the UI:
https://app.inigo.io/499/config/activity/1342
```

## Apply a Breaking Schema Change

Edit `graphql/schema.graphql` and remove `birthDate` from the schema. Save the change.

Once again we will apply the Service config which will update the schema:

```shell
inigo apply -f inigo/service.yml
```

Expected output:

```
Service: schema-demo

Changelog:
----------
service/schema_files  updated  

Steps:
------
Validation:   passed
Composition:  omitted
Operational:  failed
Evaluation:   omitted

Detected 1 breaking change(s), 0 non-breaking change(s).
New schema is validated against traffic from Wed, 16 Aug 2023 14:42:23 PDT.

Schema changes:
---------------
BREAKING: Field User.birthDate was removed.
  Location: ../graphql/schema.graphql:9:5
    -   birthDate: String
  Usage
  no usage


Execute the below command to ignore this failure on the next run:
>  inigo bypass apply d8de57a395af4b682cbdf39d88f52d28eeeaa328

Check out the report in the UI:
https://app.inigo.io/499/config/activity/1343

error: check failed, see report above for details
```



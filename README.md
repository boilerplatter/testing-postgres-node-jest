# Testing Serverless Postgres + Node with Jest

This is an example serverless API built on Platter Postgres, Node, and Netlify Functions/AWS Lambdas. It exposes a `messages` handler for storing threads of messages to a Postgres database. The purpose of this example application is to show how to test handlers with and without a database.

This repository is heavily commented, but is most useful when paired with [this blog post](https://blog.platter.dev/2021-04-28-testing-branch-databases-with-jest).

## Getting Started

To start, make sure that you've [created a Platter account](https://dashboard.platter.dev) and added a default payment method. Databases on the Platter platform are [1¢/hour per branch](https://docs.platter.dev/pricing/). You'll also need `git` and Node.js installed for your operating system.

Once you have an account, do the following:

1. Clone this repository
2. Install the dependencies with `npm install`
3. Authorize the `platter` CLI that was installed in step 2 to create Postgres instances on your behalf with `npx platter identity login`
4. Create a new Postgres instance with:

    ```bash
    npx platter postgres create testing-postgres-node-jest \
    --platform node \
    --directory ./platter
    ```

5. Create a `.env` file with a `PLATTER_API_KEY` from the [Platter developer dashboard](https://dashboard.platter.dev/keys) and a `PLATTER_POSTGRES_CLIENT` path that points to the path of your new Postgres client. If you used the command from step 4, `PLATTER_POSTGRES_CLIENT` will be `./platter/postgres/node/TestingPostgresNodeJest`. You can create that file with a single command like so:

    ```bash
    cat << EOF > .env
    PLATTER_API_KEY=<an API key from your user dashboard>
    PLATTER_POSTGRES_CLIENT=./platter/postgres/node/TestingPostgresNodeJest
    EOF
    ```

6. Run the migrations on your new instance with `npm run migrate:up`
7. Start `platter watch` and `netlify dev` at the same time with `npm run watch` to test out your messages endpoint! It should accept `POST` requests at `localhost:8888/.netlify/functions/messages`. To insert a new message with `curl`, you would run:

    ```bash
    curl -s \
      -X POST \
      -H 'Content-Type: application/json' \
      -d '{"text":"some message text"}' \
      http://localhost:8888/.netlify/functions/messages
    ```

8. To run the test suite once, use `npm test`. To run the test suite in watch mode, use `npm run test:watch`.

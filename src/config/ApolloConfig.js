import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:8080/v1/graphql",
  headers: { "x-hasura-admin-secret": "myadminsecretkey" },
  cache: new InMemoryCache(),
});

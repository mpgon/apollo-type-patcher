import React from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { ApolloProvider } from "react-apollo";
import typePatcher from "../../index";
import typeDefs from "../../__mocks__/types";

const restLink = new RestLink({
  uri: "--fetch-is-mocked--",
  typePatcher: typePatcher(typeDefs),
});

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  resolvers: {},
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, restLink]),
});

export default function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

test.skip("skip", () => {});

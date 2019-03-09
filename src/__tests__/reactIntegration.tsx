import React from "react";
import typeDefs from "../__mocks__/types";
import typePatcher from "../index";
import { render } from "react-testing-library";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";

// Polyfill global.Headers
// only necessary for test environment
// @ts-ignore
import fetch from "node-fetch";
// @ts-ignore
global.Headers = fetch.Headers;

const restLink = new RestLink({
  uri: "http://abc.com",
  typePatcher: typePatcher(typeDefs)
});
const cache = new InMemoryCache();
const stateLink = withClientState({
  cache,
  resolvers: {}
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, restLink])
});

const ApolloClientProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

const Hello = () => <ApolloClientProvider>Hello World</ApolloClientProvider>;

describe("test react", () => {
  it("should render", () => {
    const { getByText } = render(<Hello />);
    expect(getByText("Hello World")).toBeTruthy();
  });
});

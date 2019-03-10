import React from "react";
import typeDefs from "../__mocks__/types";
import typePatcher from "../index";
import { render, wait } from "react-testing-library";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { ApolloProvider, Query } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import gql from "graphql-tag";
import mockProfessor from "../__mocks__/professor";
import { testProfessor } from "./typePatcher";
// Polyfills necessary for test environment
import "@babel/polyfill";
// @ts-ignore
import nodeFetch from "node-fetch";
import fetchMock from "jest-fetch-mock";

// @ts-ignore
global.Headers = nodeFetch.Headers;
// @ts-ignore
global.fetch = fetchMock;

const restLink = new RestLink({
  uri: "--fetch-is-mocked--",
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

const GET_PROFESSOR = gql`
  query getProfessor($id: ID!) {
    professor(id: $id) @rest(type: "Professor", path: "professor/{args.id}") {
      id
      department {
        id
      }
      classes {
        id
        enrolled_students {
          id
        }
      }
      scolarship_applications {
        id
        process
        co_assistant_professor
      }
    }
  }
`;

const ApolloClientProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

// auxiliar var to save data fetched with apollo
let PROFESSOR_VAR: any = undefined;

const App = () => (
  <ApolloClientProvider>
    <Query query={GET_PROFESSOR} variables={{ id: 1 }}>
      {({ error, data }) => {
        if (error) return "loading";
        if (data && data.professor) {
          PROFESSOR_VAR = data.professor;
          return "loaded";
        }
        return "loading";
      }}
    </Query>
  </ApolloClientProvider>
);

describe("test react integration", () => {
  // @ts-ignore
  fetch.mockResponse(JSON.stringify(mockProfessor()));

  it("should type-patch query response", async () => {
    const { getByText } = render(<App />);

    await wait(() => {
      expect(getByText("loaded")).toBeTruthy();

      // Apollo should inject the root typename defined in the
      // Query component
      expect(PROFESSOR_VAR.__typename).toEqual("Professor");
      testProfessor(PROFESSOR_VAR);
    });
  });
});

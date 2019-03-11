import React from "react";
import { render, wait } from "react-testing-library";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import mockProfessor from "../__mocks__/professor";
import { testProfessor } from "./typePatcher";
import ApolloClientProvider from "./utils/ApolloClientProvider";

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

describe("test react and apollo integration", () => {
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

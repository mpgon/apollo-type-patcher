# apollo-type-patcher
Utility to generate **Type Patcher** functions for [apollo-link-rest](https://github.com/apollographql/apollo-link-rest).

[![Build Status](https://dev.azure.com/miguelgopereira/apollo-type-patcher/_apis/build/status/mpgon.apollo-type-patcher?branchName=master)](https://dev.azure.com/miguelgopereira/apollo-type-patcher/_build/latest?definitionId=2&branchName=master)

Jump to: [Goal](#goal) | [Installation](#installation) | [Usage](#usage) | [How it works](#how-it-works) | [Features](#features) | [Contribute](#contribute)

## Goal
The [apollo-link-rest](https://github.com/apollographql/apollo-link-rest) library enables a smooth, frontend-first transition into GraphQL, by allowing you to leverage this query language in a project powered by a REST API (read some of the reasons [here](https://www.apollographql.com/docs/link/links/rest.html)).
However, since you don't have a schema for your _type definitions_ (because you don't have a GraphQL server), you have to generate the **type patcher** functions [yourself](https://www.apollographql.com/docs/link/links/rest.html#options.typePatcher). This is a very verbose, time consuming and error-prone process, specially if you're trying to consume endpoints with a lot of nested fields whose types you want to normalize into the cache. 

The goal of this `apollo-type-patcher` library is to generate the **type patcher** functions easily and in a safe maintanable way, with an object contaiting your type definition mappings.


## Installation
To add this library to your project's `dependencies` simply run:
```
yarn add apollo-type-patcher
```

## Usage
> [Try it out in the browser](https://codesandbox.io)

1. Create your type definitions object. This object is in the form of
```javascript
typeDefinitions = {
    TYPE: {
        FIELD: TYPE,
        ...
    },
    ...
}
```
for example:
```javascript
// typeDefinitions.js
export const typeDefinitions = {
    Student: {
        classes: Class,
        extra_activities: Activities
    },
    Class: {
        chair_professor: Professor
    }
}
```
2. When setting up your Apollo link rest configuration, add the type patcher as follows:
```jsx
import typePatcher from "apollo-type-patcher";
import { RestLink } from "apollo-link-rest";
// your type definitions
import { typeDefinitions } from "./typeDefinitions";

const restLink = new RestLink({
  typePatcher: typePatcher(typeDefinitions),
  ...
});
```

## How it works
The type patcher adds the typename property to nested types, since the root type is injected directly by Apollo:
```jsx
// for the Query:
const GET_STUDENT = gql`
  query getStudent($id: ID!) {
    student(id: $id) @rest(type: "Student", path: "student/{args.id}") {
      id
      degree {
        id
      }
    }
  }
`;

// and for the type defintions:
typeDefinitions = {
    Student: {
        degree: Degree,
    },
}

// the output of the Apollo request (pre type patching) is:
student = {
    id: 60,
    degree: {
        id: 5,
    },
    __typename: "Student" // <- Added by Apollo directly
}

// the final of the Query (pos type patching) is:
student = {
    id: 60,
    degree: {
        id: 5,
        __typename: "Degree" // <- Added by the typePatcher
    },
    __typename: "Student"
}
```

## Features
- add types in nested objects
```javascript
// typeDef
Student: {
    class: "Class"
}
// out
student: {
    class: {
        __typename: "Class"
    }
}
```
- add types in nested arrays
```javascript
// typeDef
Student: {
    topics: "Topic"
}
// out
student: {
    topics: [{
        __typename: "Topic"
    }, ...]
}
```
- add types in deeply nested properties
```javascript
// typeDef
Student: {
    "needs.medical_needs.insurance": "Insurance"
}
// out
student: {
    needs: {
        medical_needs: {
            insurance: {
                __typename: "Insurance"
            }
        }
    }
}
```

## Contribute
After cloning the repo locally, you can run:
```node
yarn // install dependencies
yarn build // build the bundle w/webpack
yarn test // run unit tests
```

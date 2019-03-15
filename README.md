# apollo-type-patcher

Utility to generate **Type Patcher** functions for [apollo-link-rest](https://github.com/apollographql/apollo-link-rest).

[![Build Status](https://dev.azure.com/miguelgopereira/apollo-type-patcher/_apis/build/status/mpgon.apollo-type-patcher?branchName=master)](https://dev.azure.com/miguelgopereira/apollo-type-patcher/_build/latest?definitionId=2&branchName=master)

## Goal
The [apollo-link-rest](https://github.com/apollographql/apollo-link-rest) library facilitates a smooth transition of projects into GraphQL by allowing you leverage the power of GraphQL while still being powered by a REST API (read some of the benefits [here](https://www.apollographql.com/docs/link/links/rest.html)).
However, since you don't have a schema for your _type definitions_ (because you don't have a GraphQL server), you have to generate the **type patcher** functions [yourself](https://www.apollographql.com/docs/link/links/rest.html#options.typePatcher). This is a very verbose and time consuming process, specially if you're trying to consume endpoints with a lot of nested fields whose types you want to normalize into the cache. 

The goal of this `apollo-type-patcher` library is to generate the **type patcher** functions easily and in a non error-prone maintanable way, with an object contaiting your type definition mappings.


## Installation
To add this library to your project's `dependencies` simply run:
```
yarn add apollo-type-patcher
```

## Usage

> [Try it out in the browser](https://codesandbox.io)

```jsx
<Apollo />
```


## Contribute
After clone the repo locally, you can run:
```node
yarn // install dependencies
yarn build // build the bundle w/webpack
yarn test // run unit tests
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

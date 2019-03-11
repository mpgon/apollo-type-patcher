# apollo-type-patcher

Type patcher for Apollo Link Rest

[![Build Status](https://dev.azure.com/miguelgopereira/apollo-type-patcher/_apis/build/status/mpgon.apollo-type-patcher?branchName=master)](https://dev.azure.com/miguelgopereira/apollo-type-patcher/_build/latest?definitionId=2&branchName=master)

## run

```
yarn
yarn build
yarn test
```

## features

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

import addTypename from "./addTypename";
import { TypeDefinitions, FieldTypeMap, TypePatcher } from "./types";

/**
 * Calls the addTypename for the types under the
 * root value supplied
 *
 * @param data The base data response object
 *
 * @param root The field in the response
 
 * @param rootValue The type of the root field
 *
 * @param types The fields and corresponding types
 * nested under the root
 *
 * @returns True if the typename property was added
 */
function patch(
  data: object,
  root: string = "",
  rootValue: string = "",
  types: FieldTypeMap
) {
  let patchSuccess = false;
  let addResult = false;
  if (root !== "" && rootValue !== "")
    addResult = addTypename(data, root, rootValue);
  patchSuccess = patchSuccess || addResult;
  const base = root !== "" ? `${root}.` : "";
  types.forEach(({ field, type }) => {
    addResult = addTypename(data, `${base}${field}`, type);
    patchSuccess = patchSuccess || addResult;
  });
  return patchSuccess;
}

/**
 * Utility function to mark the field types that have
 * definitions of their own under a 'nested' prop
 *
 * @param typeDefinitions The type definitions object
 * that map each object in a response's field with it's type
 *
 */
function artificiallyAddNestedFields(typeDefinitions: TypeDefinitions) {
  const rootTypes = Object.keys(typeDefinitions);
  rootTypes.forEach(rootType => {
    const interiorTypes: Array<string> = Object.values(
      typeDefinitions[rootType]
    );
    const nestedTypes = interiorTypes.filter(type => rootTypes.includes(type));

    if (nestedTypes.length > 0) {
      // move nested types inside __nested: {...} prop
      // e.g. { Type1: { Field1: Type2 }, Type2: {...} }
      // becomes { Type1: __nested: { Field1: Type2 }, Type2: {...} }
      typeDefinitions[rootType].__nested = {};
      nestedTypes.forEach(type => {
        const typeKey =
          Object.keys(typeDefinitions[rootType]).find(
            key => typeDefinitions[rootType][key] == type
          ) || "";
        typeDefinitions[rootType].__nested[typeKey] = type;
        delete typeDefinitions[rootType][typeKey];
      });
    }
  });
}

/**
 * Generates the type patcher functions
 *
 * @param typeDefinitions The type definitions object
 * that map each object in a response's field with it's type
 *
 * @returns the type patcher functions
 */
export default function typePatcherFactory(typeDefinitions: TypeDefinitions) {
  artificiallyAddNestedFields(typeDefinitions);

  const out: TypePatcher = {
    // 'self' is necessary to allow the typePatcher
    // to call other type functions from itself
    self: function() {
      return this;
    }
  };
  const typePatchers: { [key: string]: FieldTypeMap } = {};

  const types = Object.keys(typeDefinitions);

  // create type patchers
  types.forEach(type => {
    const fields = Object.keys(typeDefinitions[type]).filter(
      field => field !== "__nested"
    );
    const fieldTypeMap: FieldTypeMap = [];
    fields.forEach(field =>
      fieldTypeMap.push({ field, type: typeDefinitions[type][field] })
    );
    typePatchers[type] = fieldTypeMap;
  });

  // create patch functions
  types.forEach(
    type =>
      (out[type] = function(...args: Array<any>) {
        const data = args[0];
        const pathAccumulator = args.length === 4 ? args[3] : "";

        const typePatcher = typePatchers[type];
        const patchSuccess = patch(data, pathAccumulator, type, typePatcher);
        if (patchSuccess || pathAccumulator === "") {
          // nested
          const nestedFields = typeDefinitions[type].__nested
            ? Object.keys(typeDefinitions[type].__nested)
            : [];
          nestedFields.forEach(nestedField => {
            const nestedType = typeDefinitions[type].__nested[nestedField];
            const nextPath =
              pathAccumulator === ""
                ? nestedField
                : `${pathAccumulator}.${nestedField}`;

            const thisRef = out.self();
            thisRef[nestedType](data, null, null, nextPath);
          });
        }
        return data;
      })
  );
  return out;
}

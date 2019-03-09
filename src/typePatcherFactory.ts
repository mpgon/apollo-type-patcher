import addTypename from "./addTypename";

function patch(
  data: any,
  root: string = "",
  rootValue: string = "",
  types: Array<{ field: string; type: string }>
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

function artificiallyAddNestedFields(typeDefinition: { [key: string]: any }) {
  const rootTypes = Object.keys(typeDefinition);
  rootTypes.forEach(rootType => {
    const interiorTypes: Array<string> = Object.values(
      typeDefinition[rootType]
    );
    const nestedTypes = interiorTypes.filter(type => rootTypes.includes(type));

    if (nestedTypes.length > 0) {
      // move nested types inside __nested: {...} prop
      typeDefinition[rootType].__nested = {};
      nestedTypes.forEach(type => {
        const typeKey =
          Object.keys(typeDefinition[rootType]).find(
            key => typeDefinition[rootType][key] == type
          ) || "";
        typeDefinition[rootType].__nested[typeKey] = type;
        delete typeDefinition[rootType][typeKey];
      });
    }
  });
}

// TODO: add to doc that only root types are added as keys to the
// out patcher, and every root (i.e. Query) needs a root type
// TODO: add to doc that it doesnt apply the __typename to the
// root element, because Apollo already does that for us
// TODO: add to doc cyclical references
export default function typePatcherFactory(typeDefinition: {
  [key: string]: any;
}) {
  artificiallyAddNestedFields(typeDefinition);

  const out: { [key: string]: any } = {
    self: function() {
      return this;
    }
  };
  const typePatchers: { [key: string]: any } = {};

  const types = Object.keys(typeDefinition);

  // create type patchers
  types.forEach(type => {
    const fields = Object.keys(typeDefinition[type]).filter(
      field => field !== "__nested"
    );
    const typesPatcher: Array<{ field: string; type: string }> = [];
    fields.forEach(field =>
      typesPatcher.push({ field, type: typeDefinition[type][field] })
    );
    typePatchers[type] = typesPatcher;
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
          const nestedFields = typeDefinition[type].__nested
            ? Object.keys(typeDefinition[type].__nested)
            : [];
          nestedFields.forEach(nestedField => {
            const nestedType = typeDefinition[type].__nested[nestedField];
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

import addTypename from "./addTypename";

function patch(
  data: any,
  root: string = "",
  rootValue: string = "",
  types: Array<{ field: string; type: string }>,
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

export default function typePatcherFactory(CACHE_TYPES: {
  [key: string]: any;
}): {
  [key: string]: any;
} {
  const out: { [key: string]: any } = {
    // eslint-disable-next-line
    self: function() {
      return this;
    },
  };
  const typePatchers: { [key: string]: any } = {};

  const types = Object.keys(CACHE_TYPES);

  // create type patchers
  types.forEach(type => {
    const fields = Object.keys(CACHE_TYPES[type]).filter(
      field => field !== "__nested",
    );
    const typesPatcher: Array<{ field: string; type: string }> = [];
    fields.forEach(field =>
      typesPatcher.push({ field, type: CACHE_TYPES[type][field] }),
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
          const nestedFields = CACHE_TYPES[type].__nested
            ? Object.keys(CACHE_TYPES[type].__nested)
            : [];
          nestedFields.forEach(nestedField => {
            const nestedType = CACHE_TYPES[type].__nested[nestedField];
            const nextPath =
              pathAccumulator === ""
                ? nestedField
                : `${pathAccumulator}.${nestedField}`;

            const thisRef = out.self();
            thisRef[nestedType](data, null, null, nextPath);
          });
        }
        return data;
      }),
  );
  return out;
}

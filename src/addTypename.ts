/**
 * Adds a __typename to an object/array with possible nested objects/arrays
 *
 * @param data The base data response object
 *
 * @param path The path from the base data until the target
 *
 * @param typename The __typename value
 *
 * @returns True if the typename property was added
 */
export default function addTypename(data: any, path: string, typename: string) {
  const pathArr = path.split(".");
  const result = { status: false };
  recursiveTypename(data, typename, data, pathArr, result);
  return result.status;
}

/**
 * Recursive function that does a deep search from the
 * base data until the nested target object to which the
 * __typename property should be added, and adds it
 *
 * @param elem The object being updated every iteration
 * initial it equals data
 *
 * @param typename The __typename value
 *
 * @param data The base data response object that nests the target
 * It menains immutable through all iterations
 *
 * @param path The path to be recursed from the base data
 * until the target. In every iteration but the n-1, the path array
 * is shifted
 *
 * @returns the updated data
 */
function recursiveTypename(
  elem: { [key: string]: any },
  typename: string,
  data: object,
  path: Array<string>,
  result: { status: boolean }
) {
  if (!path || !elem) return false;

  // extract next element in the path
  const nextElem = elem && elem[path[0]];
  // inject the tyename prop if it is the last element (target) if
  // the element exists
  if (path.length === 1) {
    if (
      elem !== undefined &&
      elem !== null &&
      elem[path[0]] !== undefined &&
      elem[path[0]] !== null
    ) {
      elem[path[0]] = addTypenameInobject(typename, elem[path[0]]);
      result.status = true;
      return true;
    }
    return false;
  }

  // advance the path to the next element
  // using slice instead of shift to clone the array
  const nextPath = path.slice(1);

  if (Array.isArray(nextElem)) {
    // recurse each next element if in the presence of a nested array
    nextElem.forEach(el =>
      recursiveTypename(el, typename, data, nextPath, result)
    );
  } else {
    // recurse next element
    recursiveTypename(nextElem, typename, data, nextPath, result);
  }
  return true;
}

/**
 * Adds a __typename property to the target object
 * If the target is an array, it adds the __typename
 * to all of its elements
 *
 * @param typename The __typename value
 *
 * @param target The target object or array
 *
 * @returns the target with the added __typename property
 */
function addTypenameInobject(typename: string, target: any) {
  if (target === null) return null;
  if (Array.isArray(target)) {
    return target.map(nestedobject => ({
      __typename: typename,
      ...nestedobject
    }));
  }
  return {
    __typename: typename,
    ...target
  };
}

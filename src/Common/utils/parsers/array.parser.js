import { isNil } from "../validators/common.validator.js";

/**
 * toArray(null)        -> []
 * toArray(1)           -> [1]
 * toArray([1,2])       -> [1,2]
 * toArray('a,b', ',')  -> ['a','b']   (useful for query strings)
 */
export const toArray = (value, separator) => {
  if (isNil(value)) return [];
  if (Array.isArray(value)) return value;
  if (separator && typeof value === "string") {
    return value
      .split(separator)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [value];
};

import { isNil, isPlainObject } from "../validators/common.validator.js";

/**
 * Accepts plain objects, Mongoose docs, and JSON strings.
 * Anything else returns the fallback.
 */
export const toObject = (value, fallback = {}) => {
  if (isNil(value)) return fallback;
  if (typeof value?.toObject === "function") return value.toObject(); // mongoose doc
  if (isPlainObject(value)) return { ...value };
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return isPlainObject(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

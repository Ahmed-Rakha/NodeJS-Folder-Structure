export const isNil = (v) => v === null || v === undefined;

export const isPlainObject = (v) =>
  Object.prototype.toString.call(v) === "[object Object]";

export const isEmpty = (v) => {
  if (isNil(v)) return true;
  if (typeof v === "string") return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  if (isPlainObject(v)) return Object.keys(v).length === 0;
  return false;
};

export const isNumeric = (v) =>
  (typeof v === "number" || (typeof v === "string" && v.trim() !== "")) &&
  Number.isFinite(Number(v));

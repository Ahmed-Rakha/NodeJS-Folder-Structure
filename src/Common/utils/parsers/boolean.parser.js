const TRUE_VALUES = new Set(["true", "1", "yes", "on", "y"]);
const FALSE_VALUES = new Set(["false", "0", "no", "off", "n"]);

export const toBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number")
    return value === 1 ? true : value === 0 ? false : fallback;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (TRUE_VALUES.has(v)) return true;
    if (FALSE_VALUES.has(v)) return false;
  }
  return fallback;
};

export const isNonEmptyString = (v) =>
  typeof v === "string" && v.trim().length > 0;

export const isEmail = (v) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const isUrl = (v) => {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

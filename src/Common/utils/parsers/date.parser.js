export const toDate = (value, fallback = null) => {
  if (value == null || value === "") return fallback;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
};

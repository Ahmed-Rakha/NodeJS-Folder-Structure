import { isNumeric } from "../validators/common.validator.js";

export const toNumber = (value, fallback = 0) =>
  isNumeric(value) ? Number(value) : fallback;

export const toInt = (value, fallback = 0) =>
  isNumeric(value) ? Math.trunc(Number(value)) : fallback;

export const toPositiveInt = (value, fallback = 1) => {
  const n = toInt(value, fallback);
  return n > 0 ? n : fallback;
};

// handy for pagination
export const toClampedNumber = (
  value,
  { min = -Infinity, max = Infinity, fallback = 0 } = {},
) => Math.min(max, Math.max(min, toNumber(value, fallback)));

import { isNil } from "../validators/common.validator.js";

export const toString = (value, fallback = "") =>
  isNil(value) ? fallback : String(value);

export const toTrimmed = (value, fallback = "") =>
  isNil(value) ? fallback : String(value).trim();

export const toLower = (value, fallback = "") =>
  toTrimmed(value, fallback).toLowerCase();

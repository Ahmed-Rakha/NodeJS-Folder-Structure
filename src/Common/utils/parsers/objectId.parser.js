import mongoose from "mongoose";
import { isObjectId } from "../validators/mongo.validator.js";
import { toArray } from "./array.parser.js";

export const toObjectId = (value, fallback = null) =>
  isObjectId(value) ? new mongoose.Types.ObjectId(value) : fallback;

// drops invalid ids instead of crashing the whole query
export const toObjectIdArray = (value) =>
  toArray(value, ",")
    .map((v) => toObjectId(v))
    .filter(Boolean);

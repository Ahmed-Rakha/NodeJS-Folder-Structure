import mongoose from "mongoose";

// isValidObjectId() returns true for ANY 12-char string or number,
// which is a classic bug. isObjectIdOrHexString is strict (mongoose >= 6.2.5).
export const isObjectId = (v) => mongoose.isObjectIdOrHexString(v);

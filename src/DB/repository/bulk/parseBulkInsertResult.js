import mongoose from "mongoose";
import { toArray } from "../../../Common/utils/parsers/array.parser.js";

const DUPLICATE_KEY_CODE = 11000;

const fromValidationError = (err, inputs) => ({
  index: err.index,
  document: inputs[err.index],
  errors: Object.values(err.errors ?? {}).map((e) => ({
    field: e.path,
    type: e.kind,
    message: e.message,
  })),
});

const fromWriteError = (writeError, inputs) => {
  const { code, errmsg, keyValue } = writeError.err ?? writeError;
  const isDuplicate = code === DUPLICATE_KEY_CODE;

  return {
    index: writeError.index,
    document: inputs[writeError.index],
    errors: [
      {
        type: isDuplicate ? "duplicate_key" : "write_error",
        code,
        indexName: errmsg?.match(/index:\s+(\S+)\s+dup key/)?.[1],
        value: isDuplicate
          ? (keyValue ?? errmsg?.match(/dup key:\s*(\{.*\})/)?.[1])
          : undefined,
        message: isDuplicate ? "Duplicate key error." : errmsg,
      },
    ],
  };
};

/** Pure parser: error in, { insertedDocs, failedDocs } out. No outcome building. */
export const parseBulkInsertResult = (error, inputs) => {
  const results = toArray(error.results);

  // 1. Mongoose validation errors
  const validationErrors =
    error.validationErrors ??
    results.filter((r) => r instanceof mongoose.Error.ValidationError);

  // 2. MongoDB write errors
  const failedDocs = [
    ...validationErrors.map((e) => fromValidationError(e, inputs)),
    ...toArray(error.writeErrors).map((e) => fromWriteError(e, inputs)),
  ].sort((a, b) => a.index - b.index);

  // 3. Inserted docs
  const insertedDocs =
    error.insertedDocs ?? results.filter((r) => r instanceof mongoose.Document);

  return { insertedDocs, failedDocs };
};

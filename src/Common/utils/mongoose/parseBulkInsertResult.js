import mongoose from "mongoose";

const toArray = (value) => (value == null ? [] : [].concat(value));

export const buildOutcome = (total, insertedDocs, failedDocs) => ({
  insertedDocs,
  failedDocs,
  summary: {
    total,
    inserted: insertedDocs.length,
    failed: failedDocs.length,
  },
});

export const parseBulkInsertResult = (error, inputs) => {
  console.log({ "Rakha Tesing Error": error.results });
  const results = toArray(error.results);

  // 1. Mongoose validation errors
  const validationErrors =
    error.validationErrors ??
    results.filter((r) => r instanceof mongoose.Error.ValidationError);

  const failedDocs = validationErrors.map((validationError) => ({
    index: validationError.index,
    document: inputs[validationError.index],
    errors: Object.values(validationError.errors).map((e) => ({
      field: e.path,
      type: e.kind,
      message: e.message,
    })),
  }));

  // 2. MongoDB write errors (writeError.index is the original input index)
  for (const writeError of toArray(error.writeErrors)) {
    const { code, errmsg } = writeError.err ?? writeError;
    const isDuplicate = code === 11000;

    failedDocs.push({
      index: writeError.index,
      document: inputs[writeError.index],
      errors: [
        {
          type: isDuplicate ? "duplicate_key" : "write_error",
          code,
          index: errmsg?.match(/index:\s+(\S+)\s+dup key/)?.[1],
          value: isDuplicate
            ? errmsg?.match(/dup key:\s*(\{.*\})/)?.[1]
            : undefined,
          message: isDuplicate ? "Duplicate key error." : errmsg,
        },
      ],
    });
  }

  failedDocs.sort((a, b) => a.index - b.index);

  // 3. Inserted docs: direct on MongoBulkWriteError, otherwise from `results`
  const insertedDocs =
    error.insertedDocs ?? results.filter((r) => r instanceof mongoose.Document);

  return buildOutcome(inputs.length, insertedDocs, failedDocs);
};

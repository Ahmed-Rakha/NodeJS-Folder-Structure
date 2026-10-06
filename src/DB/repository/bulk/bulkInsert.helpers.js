export const BULK_ERROR_NAMES = new Set([
  "MongoBulkWriteError",
  "MongooseBulkWriteError",
]);

const isObjectLike = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

/** Accepts one object or an array of objects, always returns a non-empty array. */
export const normalizeInputs = (inputs, label) => {
  if (inputs == null) {
    throw new BadRequestError(`${label} data is required.`);
  }

  const docs = Array.isArray(inputs) ? inputs : [inputs];

  if (docs.length === 0) {
    throw new BadRequestError(`${label} data must be a non-empty array.`);
  }
  if (!docs.every(isObjectLike)) {
    throw new BadRequestError(
      `${label} data must be an object or an array of objects.`,
    );
  }
  return docs;
};

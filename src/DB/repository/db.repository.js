import { buildOutcome } from "./bulk/buildOutcome.js";
import {
  BULK_ERROR_NAMES,
  normalizeInputs,
} from "./bulk/bulkInsert.helpers.js";

export const createOne = async (model, data, options = {}) => {
  return await model.create(data, options);
};

export const insertMany = async (model, data, options = {}) => {
  return await model.insertMany(data, options);
};

export const find = async (model, filter = {}, options = {}, select = "") => {
  console.log({ filter, options, select });
  if (!filter) filter = {};
  const doc = model.find(filter);
  if (select) doc.select(select); // for projection
  if (options.populate) doc.populate(options.populate);
  if (options.sort) doc.sort(options.sort);
  if (options.limit) doc.limit(options.limit);
  if (options.skip) doc.skip(options.skip);
  if (options.lean) doc.lean();

  return await doc.exec();
};

export const findOne = async (
  model,
  filter = {},
  options = {},
  select = "",
) => {
  if (!filter) filter = {};
  const doc = model.findOne(filter);
  if (select) doc.select(select); // for projection
  if (options.populate) doc.populate(options.populate);
  if (options.lean) doc.lean();

  return await doc.exec();
};
/**
 * Generic bulk insert with partial-success reporting.
 * @param {import("mongoose").Model} model
 * @param {object | object[]} inputs
 * @param {object} [options] extra insertMany options (session, lean, label...)
 */
export const bulkInsert = async (
  model,
  inputs,
  { label = model.modelName, ...options } = {},
) => {
  const docs = normalizeInputs(inputs, label);

  try {
    const insertedDocs = await insertMany(model, docs, {
      ordered: false,
      throwOnValidationError: true,
      ...options,
    });
    return buildOutcome(docs.length, insertedDocs, []);
  } catch (error) {
    if (!BULK_ERROR_NAMES.has(error.name)) throw error;

    const { insertedDocs, failedDocs } = parseBulkInsertResult(error, docs);

    // Bulk error we couldn't interpret: don't report it as success.
    if (failedDocs.length === 0) throw error;

    return buildOutcome(docs.length, insertedDocs, failedDocs);
  }
};

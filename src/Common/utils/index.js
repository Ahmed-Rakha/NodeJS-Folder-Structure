import * as parsers from "./parsers/index.js";
import * as validators from "./validators/index.js";
import { successResponse } from "./responses/successResponse.js";
import { parseBulkInsertResult } from "./responses/parseBulkInsertResult.js";

export const $UTILS = Object.freeze({
  parse: Object.freeze({ ...parsers }),
  validate: Object.freeze({ ...validators }),
  response: Object.freeze({ successResponse, parseBulkInsertResult }),
});

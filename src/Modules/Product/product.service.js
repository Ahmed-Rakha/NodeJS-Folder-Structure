import Product from "../../DB/Models/products.model.js";
import { createOne, insertMany } from "../../Common/repository/index.js";
import {
  buildOutcome,
  parseBulkInsertResult,
} from "../../Common/utils/mongoose/parseBulkInsertResult.js";

export const updateProduct = async (inputs) => {
  if (!inputs || !inputs.id) {
    throw new Error("Product ID is required for update.");
  }
  const { id, ...updateFields } = inputs;
  if (Object.keys(updateFields).length === 0) {
    throw new Error("No update fields provided.");
  }
  if (updateFields.stock !== undefined && parseInt(updateFields.stock) < 0) {
    throw new Error("Stock cannot be negative.");
  }
  if (
    updateFields.stock !== undefined &&
    !Number.isInteger(+updateFields.stock)
  ) {
    throw new Error("Stock must be an integer.");
  }
  //   const result = await DB.collection("products").updateOne(
  //     { _id: new ObjectId(id) },
  //     { $set: updateFields },
  //   );
  if (result.modifiedCount === 0) {
    throw new Error("No product found with the given ID or no changes made.");
  }
};

export const createProduct = async (inputs) => {
  try {
    if (!inputs) {
      throw new Error("Product data is required for creation.");
    }
    if (Array.isArray(inputs) && inputs.length === 0) {
      throw new Error("Product data must be a non-empty array.");
    }
    if (!Array.isArray(inputs) && typeof inputs !== "object") {
      throw new Error("Product data must be an object or an array of objects.");
    }
    if (!Array.isArray(inputs) && typeof inputs === "object") {
      inputs = [inputs]; // Wrap single product in an array for uniform processing
    }

    const insertedDocs = await insertMany(Product, inputs, {
      ordered: false,
      throwOnValidationError: true,
      // rawResult: true,
    });
    // console.log("Products", insertedDocs);
    return buildOutcome(inputs.length, insertedDocs, []);
  } catch (error) {
    // console.dir(error, { depth: null });
    const BULK_ERRORS = new Set([
      "MongoBulkWriteError",
      "MongooseBulkWriteError",
    ]);
    if (!BULK_ERRORS.has(error.name)) throw error;

    const { insertedDocs, failedDocs } = parseBulkInsertResult(error, inputs);
    return buildOutcome(inputs.length, insertedDocs, failedDocs);
  }
};

/*

Ordered ==> False: I would use the ordered set to false because I would like to skip the errored Docs and process the valid ones
2nd step : If I used for the rawResult option on insertMany it would return the failed docs and the valid ones in the following shape:

{
  acknowledged: true,
  insertedCount: 9,
  insertedIds: {
    '0': 'product-001',
    '1': 'product-003',
    '2': 'product-004',
  },
  mongoose: {
    validationErrors: [
                    {
                        "errors": {
                            "name": {
                                "name": "ValidatorError",
                                "message": "Path `name` is required.",
                                "properties": {
                                    "message": "Path `name` is required.",
                                    "type": "required",
                                    "path": "name"
                                },
                                "kind": "required",
                                "path": "name"
                            }
                        },
                        "_message": "Product validation failed",
                        "index": 1,
                        "name": "ValidationError",
                        "message": "Product validation failed: name: Path `name` is required."
                    }
                ],,
    results: [
      [Object],
      [ValidationError],
      [Object],
      [Object],
    ]
  }
}


3rd step: I then will construct my final response and return it to the user the failed and the inserted docs
The challenge with this solution (rawResult)==> If the error is not validation error (MongooseBulkWriteError / Schema Validation Error) 
like MongoBulkWriteError (Duplicate Key /database constraints) it will  throw the error to the CATCH Block
Then I will need handle it inside the CATCH Block and return the error to the user and the inserted docs

==================================

The other approach ==>  is to use the option throwOnValidationError: true which will throw the error 
to the CATCH Block and handle all there instead of handling it inside both the try and catch blocks like in the first approach
*/

import { NODE_ENV } from "../config.js";

export const globalErrorHandler = (err, req, res, next) => {
  return res.status(err?.cause?.status || 500).json({
    success: false,
    status: err?.cause?.status || 500,
    message: err.message,
    issues: err?.cause?.issues || [],
    error: NODE_ENV === "development" ? err : undefined,
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};

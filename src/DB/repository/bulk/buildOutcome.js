export const buildOutcome = (total, insertedDocs, failedDocs) => {
  const inserted = insertedDocs.length;
  const failed = failedDocs.length;

  return {
    insertedDocs,
    failedDocs,
    summary: {
      total,
      inserted,
      failed,
      status: failed === 0 ? "success" : inserted === 0 ? "failed" : "partial",
    },
  };
};

export const createOne = async (model, data, options = {}) => {
  return await model.create(data, options);
};

export const insertMany = async (model, data, options = {}) => {
  return await model.insertMany(data, options);
};

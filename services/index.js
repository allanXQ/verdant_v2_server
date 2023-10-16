const findQuery = async (model, query) => {
  try {
    const find = await model.find({ query }).lean();
    return find;
  } catch (error) {
    console.log(error);
  }
};

const findOneQuery = async (model, query) => {
  try {
    const find = await model.find({ query }).lean();
    return find;
  } catch (error) {
    console.log(error);
  }
};

const createQuery = async (model, query) => {
  try {
    const create = await model.create(query);
    return create;
  } catch (error) {
    console.log(error);
  }
};

const updateQuery = async (model, operator, query) => {};

const deleteQuery = async (model, query) => {};

module.exports = { findQuery };

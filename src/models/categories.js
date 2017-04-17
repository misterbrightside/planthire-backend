import { STRING } from 'sequelize';

const Category = connection => {
  return connection.define('category', {
    category: { type: STRING }
  }, {
    timestamps: false
  });
};

const getRelationInclusions = (subcatRelation, serviceRelation) => {
  return {
    include: [{
      association: subcatRelation,
      include: [serviceRelation]
    }]
  };
};

const createCategory = ({ Category, subcatRelation, serviceRelation }, data) => {
  return Category.create(data, getRelationInclusions(subcatRelation, serviceRelation));
};

const getAllCategories = ({ Category, subcatRelation, serviceRelation }) => {
  return Category.findAll(getRelationInclusions(subcatRelation, serviceRelation));
};

export default {
  Category,
  getAllCategories,
  createCategory
};
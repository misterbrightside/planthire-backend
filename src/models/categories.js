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

const getCategory = ({ Category, subcatRelation, serviceRelation }, id) => {
  return Category.findById(id, getRelationInclusions(subcatRelation, serviceRelation));
};

const createCategory = ({ Category, subcatRelation, serviceRelation }, data) => {
  return Category.create(data, getRelationInclusions(subcatRelation, serviceRelation));
};

const getAllCategories = ({ Category, subcatRelation, serviceRelation }, nested) => {
  return nested === 'false' ?
    Category.findAll() :
    Category.findAll(getRelationInclusions(subcatRelation, serviceRelation));
};

export default {
  Category,
  getAllCategories,
  createCategory,
  getCategory
};
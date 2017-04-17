import { STRING } from 'sequelize';

const Subcategory = connection => {
  return connection.define('subcategory', {
    subcategory: { type: STRING }
  }, {
    timestamps: false
  });
};

const getSubcategory = ({ Subcategory, serviceRelation }, categoryId, id) => {
  return Subcategory.findOne({
    where: { categoryId, id },
    include: [serviceRelation]
  });
};

export default {
  Subcategory,
  getSubcategory
};
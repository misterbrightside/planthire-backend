import { STRING } from 'sequelize';

const Subcategory = connection => {
  return connection.define('subcategory', {
    subcategory: { type: STRING }
  }, {
    timestamps: false
  });
};

export default {
  Subcategory
};
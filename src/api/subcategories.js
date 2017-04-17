import resource from 'resource-router-middleware';
import SubcategoryModel from '../models/subcategories';

export default ({ config, db, models }) => {
  const { Subcategory, subcatRelation, serviceRelation } = models;
  return resource({
    id: 'subcategory',
    
    load({ baseUrl }, id, callback) {
      const categoryId = baseUrl.match(/\d+/)[0];
      SubcategoryModel.getSubcategory({ Subcategory, serviceRelation }, categoryId, id)
        .then(subcategory => {
          const error = subcategory ? null : 'Subcategory not found';
          callback(error, subcategory);
        });
		},

		index({ query }, res) {

		},

		create({ body }, res) {
		},

		read({ subcategory }, res) {
       res.json(subcategory);
		},

		update({ category, body }, res) {
      res.json({lad: 'laaaaaaaaaaaad'});
		},

		delete({ category }, res) {
      res.json({lad: 'laaaaaaaaaaaad'});
		}
  });
};
import resource from 'resource-router-middleware';
import CategoryModel from '../models/categories';

export default ({ config, db, models }) => {
  const { Category, subcatRelation, serviceRelation } = models;
  return resource({
    id: 'category',
    
    load(req, id, callback) {
      CategoryModel.getCategory({ Category, subcatRelation, serviceRelation }, id)
        .then(category => {
          const error = category ? null : 'Category not found';
          callback(error, category);
        });
		},

		index({ query }, res) {
      const { nested } = query;
      CategoryModel.getAllCategories({ Category, subcatRelation, serviceRelation }, nested)
        .then(categories => res.json(categories));
		},

		create({ body }, res) {
      CategoryModel.createCategory({ Category, subcatRelation, serviceRelation }, body)
        .then(category => res.json(category));
		},

		read({ category }, res) {
      res.json(category);
		},

		update({ category, body }, res) {
      res.json({lad: 'laaaaaaaaaaaad'});
		},

		delete({ category }, res) {
      res.json({lad: 'laaaaaaaaaaaad'});
		}
  });
};
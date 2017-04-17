import resource from 'resource-router-middleware';
import CategoryModel from '../models/categories';

export default ({ config, db, models }) => {
  const { Category, subcatRelation, serviceRelation } = models;
  return resource({
    id: 'category',
    
    load(req, id, callback) {
      callback(0, 0);
		},

		index({ params }, res) {
      CategoryModel.getAllCategories({ Category, subcatRelation, serviceRelation })
        .then(categories => res.json(categories));
		},

		create({ body }, res) {
      CategoryModel.createCategory({ Category, subcatRelation, serviceRelation }, body)
        .then(category => res.json(category));
		},

		read({ category }, res) {
			// res.json(category);
      res.json({lad: 'laaaaaaaaaaaad'});
		},

		update({ category, body }, res) {
      res.json({lad: 'laaaaaaaaaaaad'});
		},

		delete({ category }, res) {
      res.json({lad: 'laaaaaaaaaaaad'});
		}
  });
};
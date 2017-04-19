import resource from 'resource-router-middleware';
import UserModel from '../models/users';

export default ({ config, db, models }) => {
  const { Subcategory } = models;
  return resource({
    id: 'subcategory',
    
    load({ baseUrl }, id, callback) {

		},

		index({ query }, res) {

		},

		create({ body }, res) {
		},

		read({ subcategory }, res) {
       res.json(subcategory);
		},

		update({ category, body }, res) {
		},

		delete({ category }, res) {
		}
  });
};
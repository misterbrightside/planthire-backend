import resource from 'resource-router-middleware';
import UserModel from '../models/users';

export default ({ config, db, models }) => {
  const { User } = models;
  return resource({
    id: 'user',
    
    load({ baseUrl }, id, callback) {
			UserModel.getUser({ User }, id)
				.then(user => {
					const error = user ? null : 'Company not found';
					callback(error, user);
				});
		},

		index({ query }, res) {
			UserModel.getAllUsers({ User })
				.then(users => res.json(users));
		},

		create({ body }, res) {
		},

		read({ user }, res) {
			console.log(user);
      res.json(user);
		},

		update({ category, body }, res) {
		},

		delete({ category }, res) {
		}
  });
};
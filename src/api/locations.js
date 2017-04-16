import resource from 'resource-router-middleware';
import LocationModel from '../models/locations';

export default ({config, db, models}) => {
	const { Location } = models;
  return resource({
		id : 'location',
		load(req, id, callback) {
		},

		index({ params }, res) {
      Location.findAll().then(locations => res.json(locations));
		},

		create({ body }, res) {
		},

		read({ location }, res) {
			res.json(location);
		},

		update({ location, body }, res) {
		},

		delete({ location }, res) {
		}
	});
};

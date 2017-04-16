import resource from 'resource-router-middleware';
import CompanyModel from '../models/companies';

export default ({ config, db, Company }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'company',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		// let facet = companies.find( facet => facet.id===id ),
		// 	err = facet ? null : 'Not found';
		// callback(err, facet);
		callback(0, 0);
	},

	/** GET / - List all entities */
	index({ params }, res) {
		console.log('hi?');
		CompanyModel.getAllCompanies(Company)
			.then(companies => 	res.json(companies));
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		CompanyModel.createCompany(Company, body)
			.then(company => res.json(company))
			.then(() => console.log('hello'));
	},

	/** GET /:id - Return a given entity */
	read({ facet }, res) {
		res.json(facet);
	},

	/** PUT /:id - Update a given entity */
	update({ facet, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				facet[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ facet }, res) {
		companies.splice(companies.indexOf(facet), 1);
		res.sendStatus(204);
	}
});

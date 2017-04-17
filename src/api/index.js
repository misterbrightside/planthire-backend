import { version } from '../../package.json';
import { Router } from 'express';
import companies from './companies';
import locations from './locations';
import categories from './categories';
import subcategories from './subcategories';

export default ({ config, db, models }) => {
	let api = Router();
	api.use('/companies', companies({ config, db, models }));
	api.use('/locations', locations({ config, db, models }));
	api.use('/categories', categories({ config, db, models }));
	api.use('/categories/:id/subcategories', subcategories({ config, db, models }));
	api.get('/', (req, res) => res.json({ version }));
	return api;
}

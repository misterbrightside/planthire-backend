import { version } from '../../package.json';
import { Router } from 'express';
import companies from './companies';
import locations from './locations';

export default ({ config, db, models }) => {
	let api = Router();
	api.use('/companies', companies({ config, db, models }));
	api.use('/locations', locations({ config, db, models }));
	api.get('/', (req, res) => res.json({ version }));
	return api;
}

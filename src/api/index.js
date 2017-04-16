import { version } from '../../package.json';
import { Router } from 'express';
import companies from './companies';

export default ({ config, db, models }) => {
	let api = Router();
	api.use('/companies', companies({ config, db, Company: models.Company }));
	api.get('/', (req, res) => res.json({ version }));
	return api;
}

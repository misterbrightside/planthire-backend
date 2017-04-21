import { version } from '../../package.json';
import { Router } from 'express';
import companies from './companies';
import locations from './locations';
import categories from './categories';
import subcategories from './subcategories';
import orders from './orders';
import users from './users';
import passport from 'passport';

export default ({ config, db, models }) => {
	let api = Router();
	api.use('/companies', companies({ config, db, models }));
	api.use('/locations', locations({ config, db, models }));
	api.use('/categories', categories({ config, db, models }));
	api.use('/categories/:id/subcategories', subcategories({ config, db, models }));
	api.use('/orders', orders({ config, db, models }));
	api.use('/users', users({ config, db, models }));
	api.get('/', passport.authenticateUser(), (req, res) => res.json({ version }));
	api.post('/sessions/user', passport.authenticate('local-user'), (req, res) => {
		res.json({hi: req.user})
	});
	api.post('/sessions/company', passport.authenticate('local-company'), (req, res) => {
		res.json({hi: req.user})
	});
	return api;
}

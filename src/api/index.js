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
	api.use('/companies', passport.authenticateBy('user'), companies({ config, db, models }));
	api.use('/locations', locations({ config, db, models }));
	api.use('/categories', categories({ config, db, models }));
	api.use('/categories/:id/subcategories', subcategories({ config, db, models }));
	api.use('/orders', orders({ config, db, models }));
	api.use('/users', users({ config, db, models }));
	// api.get('/', passport.authenticateBy('user'), (req, res) => res.json({ version }));
	api.post('/sessions/user', (req, res, next) => {
		console.log(req.session);
		if (req.session.views) {
			req.session.views++;
		} else {
			req.session.views = 1;
		};
		console.log(req.session.views, 'mad yolk ya', req.sessionID, req.cookies);
		next();
	}, passport.authenticate('local-user'), (req, res) => res.json({user: req.user, s:req.session, c: req.cookies, x: req.sessionID}));
	api.post('/sessions/company', passport.authenticate('local-company'), (req, res) => {
		res.json({user: req.user, s:req.session, c: req.cookies, x: req.sessionID})
	});
	return api;
};

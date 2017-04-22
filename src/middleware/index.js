import { Router } from 'express';

export default ({ config, db }) => {
	let routes = Router({ mergeParams: true });

	// add middleware here

	return routes;
}

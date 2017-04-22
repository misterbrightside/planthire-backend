import resource from 'resource-router-middleware';
import OrderModel from '../models/orders';

const getCompanyId = (url) => {
	const path = url.split('/');
	return path[path.length - 2];
};

export default ({ config, db, models }) => {
  const { Company, Order, User, Service, Location } = models;
  return resource({
    id: 'order',
    
    load({ baseUrl }, id, callback) {

		},

		index({ baseUrl }, res) {
			OrderModel.getAllOrdersForCompany({ Location, Service, Company, Order, User }, getCompanyId(baseUrl))
				.then(orders => res.json(orders));
		},

		create({ body }, res) {
			OrderModel.processNewOrder({ Location, Service, Company, Order, User }, body)
				.then(order => res.json(order));
		},

		read({ order }, res) {
       res.json(order);
		},

		update({ category, body }, res) {
		},

		delete({ category }, res) {
		}
  });
};
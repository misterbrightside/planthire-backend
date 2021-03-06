import resource from 'resource-router-middleware';
import OrderModel from '../models/orders';

export default ({ config, db, models }) => {
  const { Company, Order, User, Service, Location } = models;
  return resource({
    id: 'order',
    
    load({ baseUrl }, id, callback) {

		},

		index({ query }, res) {
			OrderModel.getAllOrders({ Order })
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
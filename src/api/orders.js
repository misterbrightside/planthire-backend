import resource from 'resource-router-middleware';
import OrderModel from '../models/orders';

export default ({ config, db, models }) => {
  const { Company, Order, User, Service, Location } = models;
  return resource({
    id: 'subcategory',
    
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

		read({ subcategory }, res) {
       res.json(subcategory);
		},

		update({ category, body }, res) {
		},

		delete({ category }, res) {
		}
  });
};
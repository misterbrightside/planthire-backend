import { INTEGER, STRING, DATE } from 'sequelize';

const Order = ({connection, models}) => {
  const Order = connection.define('order', {
    categoryId: { 
      type: INTEGER,
      references: {
        model: models.Category,
        key: 'id'
      }
    }, 
    subcategoryId: { 
      type: INTEGER,
      references: {
        model: models.Subcategory,
        key: 'id'
      }
    },
    serviceId: { 
      type: INTEGER,
      references: {
        model: models.Services,
        key: 'id'
      }
    },
    locationId: {
      type: INTEGER,
      references: {
        model: models.Location,
        key: 'id'
      }
    },
    email: {
      type: STRING,
    //    references: {
    //    model: User
    //   },
    },
    startDate: { type: DATE },
    endDate: { type: DATE },
  }, {
  });
  Order.belongsTo(models.Category);
  Order.belongsTo(models.Location);
  Order.belongsTo(models.Subcategory);
  Order.belongsTo(models.Service);
  return Order;
};

const createOrder = ({ Order }, data) => {
  return Order.create({
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId,
    serviceId: data.service,
    locationId: data.locationId,
    email: data.email,
    startDate: data.startDate,
    endDate: data.endDate,
  });
};

const getAllOrders = ({ Order }) => {
  return Order.findAll({ include: [{ all: true }]});
  // return Order.findAll();
}

export default {
  Order,
  createOrder,
  getAllOrders
};
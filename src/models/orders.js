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
      model: models.Subcategory,
      key: 'id',
    },
    serviceId: { 
      type: INTEGER,
      model: models.Services,
      key: 'id'
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
  Order.belongsTo(models.Subcategory);
  Order.belongsTo(models.Service);
  return Order;
};

const createOrder = ({ Order }, data) => {
  return Order.create({
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId,
    serviceId: data.service,
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
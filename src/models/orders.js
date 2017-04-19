import { INTEGER, STRING, DATE, ENUM, BOOLEAN } from 'sequelize';
import UserModel from '../models/users';

const Order = (models, connection) => {
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
      unique: true,
      references: {
        model: models.User,
        key: 'email'
      },
    },
    startDate: { type: DATE },
    endDate: { type: DATE },
    transportMethod: {
      type: ENUM('collection', 'delivery')
    },
    completed: { type: BOOLEAN }
  }, {
  });
  Order.belongsTo(models.User);
  models.User.hasMany(Order);
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
    userId: data.userId,
    transportMethod: data.transportMethod,
    completed: false
  });
};

const processNewOrder = ({ Company, Order, User }, orderData) => {
  return UserModel.getOrCreateUser({ User }, orderData)
    .then(UserModel.maybeProcessNewUser)
    .then(userId => createOrder({ Order }, Object.assign(orderData, { userId })))
    .then(order => {
      //return getAllRelevantCompanies(...).then(companies => notifiy(companies));
      return order;
    });
};
 
const getAllOrders = ({ Order }) => {
  return Order.findAll({ include: [{ all: true }]});
  // return Order.findAll();
}

export default {
  Order,
  createOrder,
  getAllOrders,
  processNewOrder
};
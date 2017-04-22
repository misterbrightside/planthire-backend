import { INTEGER, STRING, DATE, ENUM, BOOLEAN } from 'sequelize';
import UserModel from './users';
import CompanyModel from './companies';

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

const processNewOrder = ({ Location, Service, Company, Order, User }, orderData) => {
  return UserModel.getOrCreateUser({ User }, orderData)
    .then(UserModel.maybeProcessNewUser)
    .then(userId => createOrder({ Order }, Object.assign(orderData, { userId })))
    .then(order => {
      return new Promise((resolve, reject) => {
        CompanyModel.getCompaniesInterestedInLocation({ Location, Service, Company }, order)
          .then(companies => {
            const ids = companies.map(company => company.id);
            order.setCompanies(ids);
            resolve(companies);
          });
      });
    })
    .then(companies => companies.map(company => company.email))
    .then(emails => CompanyModel.notifyCompanies({ Company }, emails))
    .catch(err => console.error(err));
};
 
const getAllOrders = ({ Order }) => {
  return Order.findAll({ include: [{ all: true }]});
  // return Order.findAll();
}

const getAllOrdersForCompany = ({Location, Service, Company, Order, User}, id) => {
  return Order.findAll({
    include: [{
      model: Company,
      where: { id }
    }]
  });
};

export default {
  Order,
  createOrder,
  getAllOrdersForCompany,
  getAllOrders,
  processNewOrder
};
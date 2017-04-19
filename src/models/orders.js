import { INTEGER, STRING, DATE, ENUM } from 'sequelize';

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
    }
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
    transportMethod: data.transportMethod
  });
};

const getOrCreateUserForOrder = ({ Order, User }, data) => {
  return new Promise((resolve, reject) => {
    User.findOrCreate({
      where: {
        email: data.email 
      }, 
      defaults: {
        name: data.name,
        phone: data.phone,
        locationId: data.locationId
      }
    }).spread((user, created) => {
      resolve({ user, created });
    });
  }).then(({user, created}) => {
    if (created) {
      console.log('new user stuff here');
      //User.sendWelcomeEmail().then(...);
    }
    return createOrder({ Order }, Object.assign(data, { userId: user.id }));
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
  getOrCreateUserForOrder
};
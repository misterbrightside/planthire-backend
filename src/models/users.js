import { STRING, INTEGER } from 'sequelize';

const User = (models, connection) => {
  const UserModel = connection.define('user', {
    name: { type: STRING },
    email: {
      type: STRING,
      unique: true
    },
    phone: { type: STRING },
    locationId: {
      type: INTEGER,
      references: {
        model: models.Location,
        key: 'id'
      }
    }
  }, {});

  UserModel.belongsTo(models.Location);
  return UserModel;
};

const getOrCreateUser = ({ User }, data) => {
  return new Promise((resolve, reject) => {
    // TODO: should create an erorr status here. Redirect back to UI so that they login.
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
  });
}

const getAllUsers = ({ User }) => {
  return User.findAll({ include: [{ all: true }]});
};

const maybeProcessNewUser = ({ user, created}) => {
  if (created) {
    console.log('new user stuff here');
    //User.sendWelcomeEmail().then(...);
  }
  return user.id;
};

export default {
  User,
  getAllUsers,
  getOrCreateUser,
  maybeProcessNewUser
};
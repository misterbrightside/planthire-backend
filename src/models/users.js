import { STRING, INTEGER } from 'sequelize';
import generatePassword from 'password-generator';
import { getPasswordHash } from '../lib/util';

function User(models, connection) {
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
    },
    passwordHash: { type: STRING }
  }, {});

  UserModel.belongsTo(models.Location);
  return UserModel;
}

const getOrCreateUser = ({ User }, data) => {
  const passwordForUser = generatePassword(10, true, /[\w\d\?\-]/);
  return getPasswordHash(passwordForUser).then(hash => {
    return new Promise((resolve, reject) => {
      // TODO: should create an erorr status here. Redirect back to UI so that they login.
      User.findOrCreate({
        where: {
          email: data.email 
        }, 
        defaults: {
          name: data.name,
          phone: data.phone,
          locationId: data.locationId,
          passwordHash: hash
        }
      }).spread((user, created) => {
        resolve({ user, created, password: passwordForUser });
      });
    });
  });
}

const getAllUsers = ({ User }) => {
  // return User.findAll({ include: [{ all: true }]});
    return User.findAll();
};

const maybeProcessNewUser = ({ user, created, password }) => {
  if (created) {
    console.log('new user stuff here', password);
    //User.sendWelcomeEmail().then(...);
  }
  return user.id;
};

const getUser = ({ User }, id) => {
  return User.findById(id, { include: [{ all: true, nested: true }]});
};

export default {
  User,
  getAllUsers,
  getOrCreateUser,
  getUser,
  maybeProcessNewUser
};
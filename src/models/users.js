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

const getAllUsers = ({ User }) => {
  return User.findAll({ include: [{ all: true }]});
};

export default {
  User,
  getAllUsers
};
import { STRING } from 'sequelize';

const Service = connection => {
  return connection.define('service', {
    service: { type: STRING }
  }, {
    timestamps: false
  });
};

export default {
  Service
};
import { STRING } from 'sequelize';

const Location = connection => {
  return connection.define('location', {
    county: { type: STRING }
  }, {
    timestamps: false
  });
};

export default {
  Location
}
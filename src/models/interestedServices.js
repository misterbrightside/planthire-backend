
const InterestedServices = connection => {
  return connection.define('interestedServices', {}, {
    timestamps: false
  });
};

export default {
  InterestedServices
};
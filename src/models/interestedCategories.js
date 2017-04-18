
const InterestedCategories = connection => {
  return connection.define('interestedCategories', {}, {
    timestamps: false
  });
};

export default {
  InterestedCategories
};
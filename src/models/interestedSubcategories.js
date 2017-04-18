const InterestedSubcategories = connection => {
  return connection.define('interestedSubcategories', {}, {
    timestamps: false
  });
};

export default {
  InterestedSubcategories
};
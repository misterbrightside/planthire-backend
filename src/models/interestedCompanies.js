const InterestedCompanies = connection => {
  return connection.define('interestedCompanies', {}, {
    timestamps: false
  });
};

export default {
  InterestedCompanies
};
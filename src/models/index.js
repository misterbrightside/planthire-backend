import CompanyModel from './companies';

const initModels = connection => {
  const { Company } = CompanyModel;
  const CompanySync = Company(connection).sync({ force: false });
  return Promise.all([CompanySync]).then(values => {
    return {
      Company: values[0]
    }
  });
};

export default initModels;
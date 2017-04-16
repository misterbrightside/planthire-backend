import CompanyModel from './companies';
import LocationModel from './locations';
import COUNTIES from '../lib/counties';

const { Company } = CompanyModel;
const { Location } = LocationModel;

const initModels = connection => {
  const CompanyInit = Company(connection);
  const LocationInit = Location(connection);
  CompanyInit.hasOne(LocationInit, { as: 'CompanyLocation' });

  const CompanySync = CompanyInit.sync({ force: false });
  const LocationSync = LocationInit.sync({ force: true }).then(() => LocationInit.bulkCreate(COUNTIES));

  return Promise.all([CompanySync, LocationSync]).then(values => {
    return {
      Company: values[0],
      Location: values[1]
    }
  });
};

export default initModels;
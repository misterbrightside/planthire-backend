import CompanyModel from './companies';
import LocationModel from './locations';
import CategoryModel from './categories';
import SubcategoryModel from './subcategories';
import ServicesModel from './services';
// import COUNTIES from '../lib/counties';

const hookToConnection = connection => {
  return {
    Company: CompanyModel.Company(connection),
    Location: LocationModel.Location(connection),
    Category: CategoryModel.Category(connection),
    Subcategory: SubcategoryModel.Subcategory(connection),
    Service: ServicesModel.Service(connection)
  };
}

const initModels = connection => {
  const { 
    Company, Location, Category,
    Subcategory, Service 
  } = hookToConnection(connection);
  
  Company.belongsTo(Location);

  const subcatRelation = Category.hasMany(Subcategory);
  const serviceRelation = Subcategory.hasMany(Service);

  const CompanySync = Company.sync({ force: false });
  const LocationSync = Location.sync({ force: false });
  const CategorySync = Category.sync({ force: false });
  const SubcategorySync = Subcategory.sync({ force: false });
  const ServiceSync = Service.sync({ force: false });

  // LocationSync.then(() => Location.bulkCreate(COUNTIES)); 

  return Promise.all([
    CompanySync, LocationSync, CategorySync, SubcategorySync, ServiceSync
  ]).then(values => {
    return {
      Company: values[0],
      Location: values[1],
      Category: values[2],
      Subcategory: values[3],
      Service: values[4],
      subcatRelation,
      serviceRelation
    }
  });
};

export default initModels;
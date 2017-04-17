import CompanyModel from './companies';
import LocationModel from './locations';
import CategoryModel from './categories';
import SubcategoryModel from './subcategories';
import ServicesModel from './services';
import NotificationAreasModel from './notificationAreas'
import COUNTIES from '../lib/counties';

const hookToConnection = connection => {
  return {
    Company: CompanyModel.Company(connection),
    Location: LocationModel.Location(connection),
    Category: CategoryModel.Category(connection),
    Subcategory: SubcategoryModel.Subcategory(connection),
    Service: ServicesModel.Service(connection),
    NotificationAreas: NotificationAreasModel.NotificationAreas(connection)
  };
}

const initModels = connection => {
  const { 
    Company, Location, Category,
    Subcategory, Service, NotificationAreas
  } = hookToConnection(connection);

  Company.belongsTo(Location);
  Company.belongsToMany(Location, { through: NotificationAreas, foreignKey: 'companyId' });
  Location.belongsToMany(Company, { through: NotificationAreas, foreignKey: 'locationId' });

  const subcatRelation = Category.hasMany(Subcategory);
  const serviceRelation = Subcategory.hasMany(Service);

  const CompanySync = Company.sync({ force: false });
  const NotificationAreasSync = NotificationAreas.sync({ force: false }); 
  const LocationSync = Location.sync({ force: false });
  const CategorySync = Category.sync({ force: false });
  const SubcategorySync = Subcategory.sync({ force: false });
  const ServiceSync = Service.sync({ force: false });

  LocationSync.then(() => Location.bulkCreate(COUNTIES)); 

  return Promise.all([
    CompanySync, LocationSync, CategorySync, SubcategorySync, ServiceSync, NotificationAreasSync
  ]).then(values => {
    return {
      Company: values[0],
      Location: values[1],
      Category: values[2],
      Subcategory: values[3],
      Service: values[4],
      NotificationAreas: values[5],
      subcatRelation,
      serviceRelation,
    };
  });
};

export default initModels;
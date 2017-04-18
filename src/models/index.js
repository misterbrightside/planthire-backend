import CompanyModel from './companies';
import LocationModel from './locations';
import CategoryModel from './categories';
import SubcategoryModel from './subcategories';
import ServicesModel from './services';
import NotificationAreasModel from './notificationAreas';
import InterestedCategoriesModel from './interestedCategories';
import InterestedSubcategoriesModel from './interestedSubcategories';
import InterestedServicesModel from './interestedServices';
// import COUNTIES from '../lib/counties';

const hookToConnection = connection => {
  return {
    Company: CompanyModel.Company(connection),
    Location: LocationModel.Location(connection),
    Category: CategoryModel.Category(connection),
    Subcategory: SubcategoryModel.Subcategory(connection),
    Service: ServicesModel.Service(connection),
    NotificationAreas: NotificationAreasModel.NotificationAreas(connection),
    InterestedCategories: InterestedCategoriesModel.InterestedCategories(connection),
    InterestedSubcategories: InterestedSubcategoriesModel.InterestedSubcategories(connection),
    InterestedServices: InterestedServicesModel.InterestedServices(connection)
  };
}

const initModels = connection => {
  const { 
    Company, Location, Category,
    Subcategory, Service, NotificationAreas,
    InterestedCategories, InterestedSubcategories, InterestedServices
  } = hookToConnection(connection);

  Company.belongsTo(Location);
  Company.belongsToMany(Location, { as: 'notificationAreas', through: NotificationAreas, foreignKey: 'companyId' });
  Company.belongsToMany(Category, { through: InterestedCategories, foreignKey: 'companyId' });
  Company.belongsToMany(Subcategory, { through: InterestedSubcategories, foreignKey: 'companyId' });
  Company.belongsToMany(Service, { through: InterestedServices, foreignKey: 'companyId'});

  const subcatRelation = Category.hasMany(Subcategory);
  const serviceRelation = Subcategory.hasMany(Service);

  const CompanySync = Company.sync({ force: false });
  const NotificationAreasSync = NotificationAreas.sync({ force: false }); 
  const InterestedCategoriesSync = InterestedCategories.sync({ force: false });
  const InterestedServicesSync = InterestedServices.sync({ force: false });
  const InterestedSubcategoriesSync = InterestedSubcategories.sync({ force: false });
  const LocationSync = Location.sync({ force: false });
  const CategorySync = Category.sync({ force: false });
  const SubcategorySync = Subcategory.sync({ force: false });
  const ServiceSync = Service.sync({ force: false });

  // LocationSync.then(() => Location.bulkCreate(COUNTIES)); 

  return Promise.all([
    CompanySync, LocationSync, CategorySync, SubcategorySync,
    ServiceSync, NotificationAreasSync, InterestedCategoriesSync,
    InterestedServicesSync, InterestedSubcategoriesSync
  ]).then(values => {
    return {
      Company: values[0],
      Location: values[1],
      Category: values[2],
      Subcategory: values[3],
      Service: values[4],
      NotificationAreas: values[5],
      InterestedCategories: values[6],
      InterestedServices: values[7],
      InterestedSubcategories: values[8],
      subcatRelation,
      serviceRelation,
    };
  });
};

export default initModels;
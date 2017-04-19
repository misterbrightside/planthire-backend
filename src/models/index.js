import CompanyModel from './companies';
import LocationModel from './locations';
import CategoryModel from './categories';
import SubcategoryModel from './subcategories';
import ServicesModel from './services';
import NotificationAreasModel from './notificationAreas';
import InterestedCategoriesModel from './interestedCategories';
import InterestedSubcategoriesModel from './interestedSubcategories';
import InterestedServicesModel from './interestedServices';
import OrderModel from './orders';

const hookToConnection = connection => {
  const Location = LocationModel.Location(connection);
  const NotificationAreas = NotificationAreasModel.NotificationAreas(connection);
  const Category = CategoryModel.Category(connection);
  const Subcategory = SubcategoryModel.Subcategory(connection);
  const Service = ServicesModel.Service(connection);
  const InterestedCategories = InterestedCategoriesModel.InterestedCategories(connection);
  const InterestedSubcategories = InterestedSubcategoriesModel.InterestedSubcategories(connection);
  const InterestedServices = InterestedServicesModel.InterestedServices(connection);
  const Order = OrderModel.Order({ connection, models: { Category, Subcategory, Service, Location }});
  const subcatRelation = Category.hasMany(Subcategory);
  const serviceRelation = Subcategory.hasMany(Service);

  const models = {
    Location,
    NotificationAreas,
    Category,
    Subcategory,
    Service,
    InterestedCategories,
    InterestedSubcategories,
    InterestedServices
  };

  const Company = CompanyModel.Company(models, connection);
  return Object.assign(models, { Company, Order, subcatRelation, serviceRelation });
}

const initModels = connection => {
  const { 
    Company, Location, Category,
    Subcategory, Service, NotificationAreas,
    InterestedCategories, InterestedSubcategories, InterestedServices,
    Order, subcatRelation, serviceRelation
  } = hookToConnection(connection);

  const promisesSyncToDb = [
    Company, Location, Category, Subcategory, Service,
    NotificationAreas, InterestedCategories,
    InterestedServices, InterestedSubcategories, Order
  ].map(model => model.sync({ force: false }));

  const promisesForceSyncToDb = [].map(model => model.sync({ force: true }));
  const promises = promisesSyncToDb.concat(promisesForceSyncToDb);

  return Promise.all(promises).then(values => {
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
      Order: values[9],
      subcatRelation,
      serviceRelation,
    };
  });
};

export default initModels;
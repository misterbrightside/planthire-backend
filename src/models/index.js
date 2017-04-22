import CompanyModel from './companies';
import LocationModel from './locations';
import CategoryModel from './categories';
import SubcategoryModel from './subcategories';
import ServicesModel from './services';
import NotificationAreasModel from './notificationAreas';
import InterestedCategoriesModel from './interestedCategories';
import InterestedSubcategoriesModel from './interestedSubcategories';
import InterestedServicesModel from './interestedServices';
import InterestedCompaniesModel from './interestedCompanies';
import OrderModel from './orders';
import UserModel from './users';

const hookToConnection = connection => {
  const Location = LocationModel.Location(connection);
  const NotificationAreas = NotificationAreasModel.NotificationAreas(connection);
  const Category = CategoryModel.Category(connection);
  const Subcategory = SubcategoryModel.Subcategory(connection);
  const Service = ServicesModel.Service(connection);
  const InterestedCategories = InterestedCategoriesModel.InterestedCategories(connection);
  const InterestedSubcategories = InterestedSubcategoriesModel.InterestedSubcategories(connection);
  const InterestedServices = InterestedServicesModel.InterestedServices(connection);
  const InterestedCompanies = InterestedCompaniesModel.InterestedCompanies(connection);
  const User = UserModel.User({ Location }, connection);
  const subcatRelation = Category.hasMany(Subcategory);
  const serviceRelation = Subcategory.hasMany(Service);
  const Order = OrderModel.Order({ Category, Subcategory, Service, Location, User }, connection);

  const models = {
    Location,
    NotificationAreas,
    Category,
    Subcategory,
    Service,
    InterestedCategories,
    InterestedSubcategories,
    InterestedServices,
    Order
  };

  const Company = CompanyModel.Company(models, connection);
  Order.belongsToMany(Company, { through: InterestedCompanies, foreignKey: 'orderId' });
  return Object.assign(models, { Company, User, subcatRelation, InterestedCompanies, serviceRelation });
}

const initModels = connection => {
  const { 
    Company, Location, Category,
    Subcategory, Service, NotificationAreas,
    InterestedCategories, InterestedSubcategories, InterestedServices,
    Order, subcatRelation, serviceRelation, User, InterestedCompanies
  } = hookToConnection(connection);

  const promisesSyncToDb = [
    Company, Location, Category, Subcategory, Service,
    NotificationAreas, InterestedCategories,
    InterestedServices, InterestedSubcategories, Order,
    User, InterestedCompanies
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
      User: values[10],
      InterestedCompanies: values[11],
      subcatRelation,
      serviceRelation,
    };
  });
};

export default initModels;
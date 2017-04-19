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
// import COUNTIES from '../lib/counties';

const hookToConnection = connection => {
  const Location = LocationModel.Location(connection);
  const NotificationAreas = NotificationAreasModel.NotificationAreas(connection);
  const Category = CategoryModel.Category(connection);
  const Subcategory = SubcategoryModel.Subcategory(connection);
  const Service = ServicesModel.Service(connection);
  const InterestedCategories = InterestedCategoriesModel.InterestedCategories(connection);
  const InterestedSubcategories = InterestedSubcategoriesModel.InterestedSubcategories(connection);
  const InterestedServices = InterestedServicesModel.InterestedServices(connection);
  const Order = OrderModel.Order({ connection, models: { Category, Subcategory, Service }});
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

  const promises = [
    Company, NotificationAreas, InterestedCategories,
    InterestedServices, InterestedSubcategories, Location,
    Category, Subcategory, Service, Order
  ].map(model => model.sync({ force: false }));

  // const CompanySync = Company.sync({ force: false });
  // const NotificationAreasSync = NotificationAreas.sync({ force: false }); 
  // const InterestedCategoriesSync = InterestedCategories.sync({ force: false });
  // const InterestedServicesSync = InterestedServices.sync({ force: false });
  // const InterestedSubcategoriesSync = InterestedSubcategories.sync({ force: false });
  // const LocationSync = Location.sync({ force: false });
  // const CategorySync = Category.sync({ force: false });
  // const SubcategorySync = Subcategory.sync({ force: false });
  // const ServiceSync = Service.sync({ force: false });
  // const OrderSync = Order.sync({ force: false });

  // LocationSync.then(() => Location.bulkCreate(COUNTIES)); 

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
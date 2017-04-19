import { STRING, col } from 'sequelize';
import sendMail from '../lib/email';

const Company = (models, connection) => {
  const CompanyModel = connection.define('company', {
    companyName: { type: STRING },
    correspondenceName: { type: STRING },
    email: {
      type: STRING,
      unique: true
    },
    phone: { type: STRING }
  });
  CompanyModel.belongsTo(models.Location);
  CompanyModel.belongsToMany(models.Location, { as: 'notificationAreas', through: models.NotificationAreas, foreignKey: 'companyId' });
  CompanyModel.belongsToMany(models.Category, { through: models.InterestedCategories, foreignKey: 'companyId' });
  CompanyModel.belongsToMany(models.Subcategory, { through: models.InterestedSubcategories, foreignKey: 'companyId' });
  CompanyModel.belongsToMany(models.Service, { through: models.InterestedServices, foreignKey: 'companyId'});
  return CompanyModel;
};

const enterCompanyIntoDatabase = (Company, data) => {
  return Company.create({
    companyName: data.companyName,
    correspondenceName: data.correspondenceName,
    email: data.email,
    phone: data.phone
  }).then(company => company.setLocation(data.locationId))
    .then(company => {
      const notificationsPromise = company.setNotificationAreas(data.notificationAreas);
      const categoriesPromise = company.setCategories(data.interestedCategories);
      const subcategoriesPromise = company.setSubcategories(data.interestedSubcategories);
      const servicesPromise = company.setServices(data.interestedServices);
      return Promise.all([notificationsPromise, categoriesPromise, subcategoriesPromise, servicesPromise])
        .then(values => company);
    });
};

const createCompany = ({Company}, data) => {
  return enterCompanyIntoDatabase(Company, data);
};

const getJoiningCriteria = (Location, NotificationAreas, id) => {
  return { include: [{ all: true }]};
}

const getAllCompanies = ({Company, Location}) => {
  return Company.findAll(getJoiningCriteria(Location));
};

const getCompany = ({Company, Location, NotificationAreas}, id) => {
   return Company.findById(id, getJoiningCriteria(Location, NotificationAreas, id));
};

const updateCompany = (company, body) => {
  return company.update(body);
};

const deleteCompany = company => {
  return company.destroy();
};

const sendNewCompanyRegistrationMail = body => {
  sendMail({ to: body.email });
};

const getCompaniesInterestedInLocation = ({ Location, NotificationAreas, Company }, location) =>  {
  console.log(location);
  return Company.findAll({
    include: [{
      model: Location,
      as: 'notificationAreas',
      where: { id: location }
    }]
  });
};

export default {
  Company,
  getCompaniesInterestedInLocation,
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  sendNewCompanyRegistrationMail
};

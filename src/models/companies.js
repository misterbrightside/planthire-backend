import { STRING } from 'sequelize';
import sendMail from '../lib/email';

const Company = connection => {
  return connection.define('company', {
    companyName: { type: STRING },
    correspodenceName: { type: STRING },
    email: {
      type: STRING,
      unique: true
    },
    phone: { type: STRING }
  });
};

const enterCompanyIntoDatabase = (Company, data) => {
  return Company.create({
    companyName: data.companyName,
    correspodenceName: data.correspodenceName,
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
  return ({ include: [{ all: true }]});
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

export default {
  Company,
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  sendNewCompanyRegistrationMail
};

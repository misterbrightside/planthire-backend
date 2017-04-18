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
      company.setNotificationAreas(data.notificationAreas);
      company.setCategories(data.interestedCategories);
      company.setSubcategories(data.interestedSubcategories);
      company.setServices(data.interestedServices);
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

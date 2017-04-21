import { STRING, col } from 'sequelize';
import sendMail from '../lib/email';
import generatePassword from 'password-generator';
import { getPasswordHash } from '../lib/util';

const Company = (models, connection) => {
  const CompanyModel = connection.define('company', {
    companyName: { type: STRING },
    correspondenceName: { type: STRING },
    email: {
      type: STRING,
      unique: true
    },
    passwordHash: { type: STRING },
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
  const passwordForUser = generatePassword(10, true, /[\w\d\?\-]/);
  return getPasswordHash(passwordForUser).then(hash => {
    return Company.create({
      companyName: data.companyName,
      correspondenceName: data.correspondenceName,
      email: data.email,
      phone: data.phone,
      passwordHash: hash
    }).then(company => company.setLocation(data.locationId))
      .then(company => {
        const notificationsPromise = company.setNotificationAreas(data.notificationAreas);
        const categoriesPromise = company.setCategories(data.interestedCategories);
        const subcategoriesPromise = company.setSubcategories(data.interestedSubcategories);
        const servicesPromise = company.setServices(data.interestedServices);
        return Promise.all([notificationsPromise, categoriesPromise, subcategoriesPromise, servicesPromise])
          .then(values => company);
      })
  }).then(company => ({ password: passwordForUser, company }));
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

const sendNewCompanyRegistrationMail = (password, body) => {
  sendMail({ to: body.email, html: `welcome to plant hire ireland, ur pass is ${password}` });
};

const getCompaniesInterestedInLocation = ({ Location, Service, Company }, order) =>  {
  return Company.findAll({
    include: [{
      model: Location,
      as: 'notificationAreas',
      where: { id: order.locationId }
    }, {
      model: Service,
      where: { id: order.serviceId }
    }],
    attributes: ['email']
  });
};

const sendNotificationEmail = emailAddress => {
  return sendMail({ to: emailAddress, html: 'Hey someone wants ur stuff.' });
}

const notifyCompanies = ({ Company }, emails) => {
  console.log(emails);
  return emails.map(email => sendNotificationEmail(email));
}

export default {
  Company,
  getCompaniesInterestedInLocation,
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  sendNewCompanyRegistrationMail,
  notifyCompanies
};

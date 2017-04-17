import { STRING } from 'sequelize';
import sendMail from '../lib/email';

const Company = connection => {
  return connection.define('company', {
    companyName: { type: STRING },
    correspodenceName: { type: STRING },
    email: { type: STRING },
    phone: { type: STRING }
  });
};

const checkIfEmailAlreadyExists = (Company, email) => {
  return Company.findAndCountAll({
    where: { email }
  });
};

const enterCompanyIntoDatabase = (Company, data) => {
  return Company.create({
    companyName: data.companyName,
    correspodenceName: data.correspodenceName,
    email: data.email,
    phone: data.phone
  }).then(company => {
    return company.setLocation(data.locationId);
  })
};

const createCompany = (Company, data) => {
  return checkIfEmailAlreadyExists(Company, data.email)
    .then(companies => {
        return new Promise((resolve, reject) => {
          return companies.count === 0 ? 
            resolve(enterCompanyIntoDatabase(Company, data)) :
            reject({
              status: 409,
              erorr: 'Email is already in use.'
            });
        });
      });
};

const getJoiningCriteria = (Location) => {
  return {
    include: [Location],
    attributes: { exclude: ['locationId'] }
  };
}

const getAllCompanies = ({Company, Location}) => {
  return Company.findAll(getJoiningCriteria(Location));
};

const getCompany = ({Company, Location}, id) => {
   return Company.findById(id, getJoiningCriteria(Location));
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

import { STRING } from 'sequelize';

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
  });
}

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

const getAllCompanies = (Company) => {
  return Company.findAll();
}

export default {
  Company,
  createCompany,
  getAllCompanies
};

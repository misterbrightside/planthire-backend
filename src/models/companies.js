import { STRING } from 'sequelize';

const Company = connection => {
  return connection.define('company', {
    companyName: { type: STRING },
    correspodenceName: { type: STRING },
    email: { type: STRING },
    phone: { type: STRING }
  });
};

const createCompany = (Company, data) => {
	return Company.create({
		companyName: data.companyName,
		correspodenceName: data.correspodenceName,
    email: data.email,
		phone: data.phone
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

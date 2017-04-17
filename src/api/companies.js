import resource from 'resource-router-middleware';
import CompanyModel from '../models/companies';

export default ({ config, db, models }) => {
	const { Company, Location } = models;
	return resource({
		id : 'company',
		load(req, id, callback) {
			CompanyModel.getCompany({Company, Location}, id)
				.then(company => {
					const error = company ? null : 'Company not found';
					callback(error, company);
				});
		},

		index({ params }, res) {
			CompanyModel.getAllCompanies({Company, Location})
				.then(companies => res.json(companies));
		},

		create({ body }, res) {
			CompanyModel.createCompany(Company, body)
				.then(company => res.status(200).json(company))
				.then(() => CompanyModel.sendNewCompanyRegistrationMail(body))
				.catch(error => res.status(error.status).json(error));
		},

		read({ company }, res) {
			res.json(company);
		},

		update({ company, body }, res) {
			CompanyModel.updateCompany(company, body)
				.then(company => res.sendStatus(204));
		},

		delete({ company }, res) {
			CompanyModel.deleteCompany(company)
				.then(() => res.sendStatus(204));
		}
	});
};

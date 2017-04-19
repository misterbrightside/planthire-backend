import resource from 'resource-router-middleware';
import CompanyModel from '../models/companies';

export default ({ config, db, models }) => {
	const { 
		Company, Location, NotificationAreas
	} = models;
	return resource({
		id : 'company',
		load(req, id, callback) {
			CompanyModel.getCompany({Company, Location, NotificationAreas}, id)
				.then(company => {
					const error = company ? null : 'Company not found';
					callback(error, company);
				});
		},

		index({ params }, res) {
			CompanyModel.getAllCompanies({Company, Location, NotificationAreas})
				.then(companies => res.json(companies));
		},

		create({ body }, res) {
			CompanyModel.createCompany({Company, NotificationAreas}, body)
				.then(company => res.status(200).json(company))
				// .then(() => CompanyModel.sendNewCompanyRegistrationMail(body))
				.catch(error => {
					if (error.name === 'SequelizeUniqueConstraintError') {
						res.status(409).json(error.errors);
					} else {
						console.log(error);
						res.status(500).json(error);
					}
				});
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

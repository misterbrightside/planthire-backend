import Sequelize from 'sequelize';

const connection = new Sequelize('postgres://qzanemqxlffhjm:d4fb74a1d95d40429a9abb7e57c539641be88363f01e73cd45c2b1d488d5c49b@ec2-50-19-95-47.compute-1.amazonaws.com:5432/da832u3r9bi8ai', {
	dialect: 'postgres',
	protocol: 'postgres',
	dialectOptions: {
			ssl: true
	}
});

export default callback => {
	connection
		.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.');
			callback(connection);
		})
		.catch(err => console.log('Unable to connect to the database:', err));
}

const Sequelize = require('sequelize');

const secrets = require('./secrets.js');

class SQLConnection {
	constructor() {
		this.db = new Sequelize(secrets.DATABASE_NAME, "root", secrets.DATABASE_ROOT_PASSWORD, {
			dialect: 'mysql',
			port: 3306,
			host: 'localhost',
			provider: 'mysql',
			logging: false,
		});
	}

	async start() {
		await this.db.authenticate();
		return this.db.sync()
			.then(() => console.log(`Successfully connected to database!`))
			.catch((err) => console.log(err));
	}
}

module.exports = new SQLConnection();
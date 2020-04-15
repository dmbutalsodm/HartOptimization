const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

const jobMachines = db.define('jobMachines', {
	jobId: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    machineId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
});

db.sync();

module.exports = {
    
}
const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

const jobMachines = db.define('jobMachines', {
	jobId: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    partsProduced: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

db.sync();

module.exports = {
    
}
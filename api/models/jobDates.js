const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table holds active jobs, and their production goals/realities per day.
const jobMachines = db.define('jobMachines', {
	jobId: {
        type: DataTypes.STRING, // Dual primary key
        allowNull: false,
        primaryKey: true
    },
    machine: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    partsDesired: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    partsProduced: {
        type: DataTypes.INTEGER,
    }
});

db.sync();

module.exports = {
    
}
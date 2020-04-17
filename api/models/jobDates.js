const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table needs to be reworked. Should be what machines are tasked to do each hour of the day.
const opMachines = db.define('opMachines', {
	opId: {
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
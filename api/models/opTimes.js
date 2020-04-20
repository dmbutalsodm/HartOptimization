const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table needs to be reworked. Should be what machines are tasked to do each hour of the day.
const opTimes = db.define('opTimes', {
	partId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    opId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // The triple primary key makes it so no op can start on the same machine at the same time,
    // Though it doesnt do anything after the start times.
    machineId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    day: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    // Which 15-minute interval of the day the op starts on/"before". Range 0-95
    interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    // How many 15 minute intervals the op takes up.
    length: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

db.sync();

module.exports = {
    
}
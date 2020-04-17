const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table holds jobs and the machines that are physically capable of performing them.
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
    // Add row delcaring JOB can be performed on MACHINE
    addJobMachine(jobId, machineId) {
        return jobMachines.upsert({
            jobId: jobId,
            machineId: machineId
        });
    }
}
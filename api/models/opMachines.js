const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table holds ops and the machines that are physically capable of performing them.
const opMachines = db.define('opMachines', {
	opId: {
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
    // Add row delcaring OP can be performed on MACHINE
    addOpMachine(opId, machineId) {
        return opMachines.upsert({
            opId: opId,
            machineId: machineId
        });
    }
}
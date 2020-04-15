const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

const machines = db.define('machines', {
	id: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

db.sync();

module.exports = {
    async buildMachineDatabase(machineManager) {
        return machines.findAll().then(rows => {
            rows.forEach((row) => {
                const r = row.get();
                machineManager.getOrCreateTool(r.id).attributes[r.key] = r.value;
            });
            console.log(machineManager.machines);
        })
    },

    insertMachine(machine) {
        for(const key of Object.keys(machine.attributes)) {
            machines.create({
                id: machine.id,
                key: key,
                value: machine.attributes[key]
            })
        }
    },
}
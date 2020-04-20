const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table holds machines and their attributes
const machines = db.define('machines', {
	id: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {timestamps: false});

db.sync();


module.exports = {
    // Machines are held in memory, so information must be gathered about them and cached on launch.
    async buildMachineDatabase() {
        const machineManager = require('../objects/machine/MachineManager.js')
        return machines.findAll().then(rows => {
            rows.forEach((row) => {
                const r = row.get();
                machineManager.getOrCreateMachine(r.id).attributes[r.tag] = r.value;
            });
            console.log(machineManager.machines);
        })
    },

    // Add a new machine to the database.
    insertMachine(machine) {
        for(const tag of Object.keys(machine.attributes)) {
            machines.create({
                id: machine.id,
                tag: tag,
                value: machine.attributes[tag]
            })
        }
    },
}
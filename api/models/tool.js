const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

const tools = db.define('tools', {
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
    machine: {
        type: DataTypes.STRING
    },
    units: {
        type: DataTypes.STRING,
    }
});

db.sync();

module.exports = {
    async buildToolDatabase(toolManager) {
        return tools.findAll().then(rows => {
            rows.forEach((row) => {
                const r = row.get();
                toolManager.getOrCreateTool(r.id).attributes[r.key] = r.value;
            });
            console.log(toolManager.tools);
        })
    },

    insertTool(tool) {
        for(const key of Object.keys(tool.attributes)) {
            tools.create({
                id: tool.id,
                key: key,
                value: tool.attributes[key]
            })
        }
    },

    insertToolIntoMachine(tool, machine) {
        return tools.findAll({
            where: {
                id: tool.id
            }
        }).then(rows => {
            rows.forEach(row => {
                row.setDataValue('machine', machine.id);
            })
        })
    }

}
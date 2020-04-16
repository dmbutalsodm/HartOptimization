const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

const tools = db.define('tools', {
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
    machine: {
        type: DataTypes.STRING
    },
    units: {
        type: DataTypes.STRING,
    }
});

db.sync();

module.exports = {
    async buildToolDatabase() {
        const toolManager = require('../objects/tool/ToolManager.js')
        return tools.findAll().then(rows => {
            rows.forEach((row) => {
                const r = row.get();
                toolManager.getOrCreateTool(r.id).attributes[r.tag] = r.value;
            });
            console.log(toolManager.tools);
        })
    },

    insertTool(tool) {
        for(const tag of Object.keys(tool.attributes)) {
            tools.create({
                id: tool.id,
                tag: tag,
                value: tool.attributes[tag]
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
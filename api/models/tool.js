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
}, {timestamps: false});

db.sync();

// This table holds tools and their attributes, and the machine they are currentlky in.
module.exports = {
    // Tools are cached in memory, so this cache must be rebuilt on launch.
    async buildToolDatabase() {
        const toolManager = require('../objects/tool/ToolManager.js')
        return tools.findAll().then(rows => {
            rows.forEach((row) => {
                const r = row.get();
                toolManager.getOrCreateTool(r.id, r.machine).attributes[r.tag] = r.value;
            });
        })
    },

    // Insert a new tool into the database.
    insertTool(tool) {
        for(const tag of Object.keys(tool.attributes)) {
            tools.create({
                id: tool.id,
                tag: tag,
                value: tool.attributes[tag],
                machine: tool.machine
            })
        }
    },

    // Add a tool to a machine. In the db, this means populating the 'machine' value.
    insertToolIntoMachine(toolID, machineID) {
        return tools.findAll({
            where: {
                id: toolID
            }
        }).then(rows => {
            rows.forEach(row => {
                row.update({
                    'machine': machineID
                });
            })
        })
    },

    // Opposite of aboove.
    freeTool(toolID) {
        return tools.update({
            machine: null
        }, {
            where: {
                id: toolID
            }
        })
    }
}
const { Sequelize, DataTypes } = require('sequelize');
const Op = Sequelize.Op;
const Database = require('../db.js');

const db = Database.db;

// This table holds ops and the tools that are required to perform them.
const opTools = db.define('opTools', {
	opId: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    toolId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
}, {timestamps: false});

db.sync();

module.exports = {
    // Add a row to declare that OP needs TOOL
    addOpTool(opId, toolId) {
        return opTools.upsert({
            opId: opId,
            toolId: toolId
        });
    },

    async getOpTools(opId) {
        return opTools.findAll({where: {opId: opId}}).then(row => {
            return row.map(r => r.get().toolId);
        });
    },

    async updateOpTools(opId, toDelete, toAdd) {
        if (toDelete.length) return opTools.destroy({where: {
            opId: opId,
            toolId: {
                [Op.or]: toDelete
            }
        }}).then(() => {
            toAdd.forEach(tool => {
                opTools.upsert({
                    opId: opId,
                    toolId: tool
                })
            })
        })
        else {
            toAdd.forEach(tool => {
                opTools.upsert({
                    opId: opId,
                    toolId: tool
                })
            })
            return;
        }
    },

    async deleteOpToolByOpId(opId) {
        return opTools.destroy({
            where: {
                opId: opId
            }
        })
    },

    async deleteOpToolByToolId(toolId) {
        return opTools.destroy({
            where: {
                toolId: toolId
            }
        })
    }
}
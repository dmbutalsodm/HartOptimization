const { Sequelize, DataTypes } = require('sequelize');
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
});

db.sync();

module.exports = {
    // Add a row to declare that OP needs TOOL
    addOpTool(opId, toolId) {
        return opTools.upsert({
            opId: opId,
            toolId: toolId
        });
    }
}
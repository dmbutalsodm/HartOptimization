const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

const jobTools = db.define('jobTools', {
	jobId: {
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
    addJobTool(jobId, toolId) {
        return jobTools.upsert({
            jobId: jobId,
            toolId: toolId
        });
    }
}
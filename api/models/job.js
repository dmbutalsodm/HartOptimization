const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

const job = db.define('jobs', {
	jobId: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    jobName:             { type: DataTypes.STRING  },
    activeMachine:       { type: DataTypes.STRING  },
    startDate:           { type: DataTypes.STRING  },
    dueDate:             { type: DataTypes.STRING  },
    possibleDays:        { type: DataTypes.INTEGER },
    partCount:           { type: DataTypes.INTEGER },
    minPartsPerDay:      { type: DataTypes.INTEGER },
    enteredPartsPerDay:  { type: DataTypes.INTEGER },
    setupDays:           { type: DataTypes.INTEGER },
    projectedFinishDays: { type: DataTypes.INTEGER },
    projectedFinishDate: { type: DataTypes.STRING  },
});
           
db.sync();

module.exports = {
    
}
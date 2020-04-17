const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;


// This table holds all template jobs, which can be instantiated to active jobs.
const job = db.define('jobs', {
	jobId: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    jobName:             { type: DataTypes.STRING, allowNull: false },
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
    // Add a new template job
    addNewEmptyJob(jobName, jobId) {
        return job.create({
            jobId: jobId,
            jobName: jobName
        });
    },

    // For duplicate checking.
    jobNameExists(jobName) {
        return job.findOne({
            where: {
                jobName: jobName
            }
        }).then(modelOrNull => !!modelOrNull);
    }
}
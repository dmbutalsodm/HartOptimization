const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;


// This table holds all template ops, which can be instantiated to active ops.
const op = db.define('ops', {
	opId: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    partId:              { type: DataTypes.STRING, allowNull: true /** BUT MAKE FALSE LATER */ , primaryKey: false},
    opName:              { type: DataTypes.STRING, allowNull: false },
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
    // Add a new template op
    addNewEmptyOp(opName, opId) {
        return op.create({
            opId: opId,
            opName: opName
        });
    },

    // For duplicate checking.
    async opNameExists(opName) {
        return op.findOne({
            where: {
                opName: opName
            }
        }).then(modelOrNull => !!modelOrNull);
    }
}
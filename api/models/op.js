const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;


// This table holds all ops of parts. The tooling information is held in opTools, the machine requirements are in opMachines.
const ops = db.define('ops', {
	opId: {
        type: DataTypes.STRING, // Dual primary key :) 
        allowNull: false,
        primaryKey: true
    },
    // Opcode is an external value that is used when defining the process of a part
    opCode:              { type: DataTypes.INTEGER, primaryKey: true},
    parentPartId:        { type: DataTypes.STRING,  primaryKey: true},
    opName:              { type: DataTypes.STRING,  allowNull: false},
    intervals:           { type: DataTypes.INTEGER, allowNull: false},
}, {timestamps: false});

db.sync();

module.exports = {
    // Add a new template op
    addNewOp(opName, opId, opCode, parentPart, opIntervals) {
        return ops.create({
            opId: opId,
            opCode: opCode,
            opName: opName,
            parentPartId: parentPart,
            intervals: opIntervals
        });
    },

    // For duplicate checking.
    async opNameExists(opName) {
        return ops.findOne({
            where: {
                opName: opName
            }
        }).then(modelOrNull => !!modelOrNull);
    },

    async getPartOps(partId) {
        const opMachines = require('./opMachines');
        const opTools    = require('./opTools');
        return ops.findAll({where: {parentPartId: partId}}).then(async rows => {
            rows = rows.map(r => r.get());
            for (r of rows) {
                r.machines = await opMachines.getOpMachines(r.opId);
                r.tools    = await opTools.getOpTools(r.opId);
            }
            rows.sort((a, b) => a.opCode - b.opCode);
            return rows;
        })

    }
}
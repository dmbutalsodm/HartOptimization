let Uuid = require('../UuidGenerator.js');
let opDB = require('../../models/op.js');
let opMachinesDB = require('../../models/opMachines.js');
let opToolsDB = require('../../models/opTools.js')

// Class for coordinating ops and their information.
class OpManager {

    // Function responsible for sending op information to the proper db tables.
    async createNewOp(opName, opCode, machineArray, toolArray, parentPart, opIntervals, isSequential) {
        // Ops are not represented in memory, so we can generate a new ID on creation.
        let opId = Uuid.getPrefixedSnowflake("o");

        // Sends to the op table with the minimum info required to make a template.
        opDB.addNewOp(opName, opId, opCode, parentPart, opIntervals, isSequential);

        // Add each tool to the opTools table, op needs tool toolId
        toolArray.forEach(async toolId => {
            return opToolsDB.addOpTool(opId, toolId);
        });

        // same for machines/opMachines
        machineArray.forEach(async machineId => {
            return opMachinesDB.addOpMachine(opId, machineId)
        });

        return opId;
    }

    // For dupe checking
    async opNameExists(opName) {
        return opDB.opNameExists(opName);
    }

    async updateOpTools(opId, toDelete, toAdd) {
        return opToolsDB.updateOpTools(opId, toDelete, toAdd);
    }

    async updateOpMachines(opId, toDelete, toAdd) {
        return opMachinesDB.updateOpMachines(opId, toDelete, toAdd);
    }

    async getOp(opId) {
        const op = await opDB.getOp(opId);
        op.machines = await opMachinesDB.getOpMachines(opId);
        op.tools = await opToolsDB.getOpTools(opId);
        return op;
        
    }
}

module.exports = new OpManager(); 
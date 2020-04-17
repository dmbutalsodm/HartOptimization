let Uuid = require('../UuidGenerator.js');
let opDB = require('../../models/op.js');
let opMachinesDB = require('../../models/opMachines.js');
let opToolsDB = require('../../models/opTools.js')

// Class for coordinating ops and their information.
class OpManager {

    // Function responsible for sending op information to the proper db tables.
    createNewOp(opName, machineArray, toolArray) {
        // Ops are not represented in memory, so we can generate a new ID on creation.
        let opId = Uuid.getPrefixedSnowflake("o");

        // Sends to the op table with the minimum info required to make a template.
        opDB.addNewEmptyOp(opName, opId);

        // Add each tool to the opTools table, op needs tool toolId
        toolArray.forEach(async toolId => {
            return opToolsDB.addOpTool(opId, toolId);
        });

        // same for machines/opMachines
        machineArray.forEach(async machineId => {
            return opMachinesDB.addOpMachine(opId, machineId);
        });
    }

    // For dupe checking
    async opNameExists(opName) {
        return opDB.opNameExists(opName);
    }
}

const single = new OpManager();
module.exports = single; 
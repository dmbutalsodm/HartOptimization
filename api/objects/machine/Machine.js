const machineDB = require('../../models/machine.js')

module.exports = class Machine {
    attributes = {};
    id;

    constructor(machineAttributes) {
        this.id = machineAttributes.id;
        delete machineAttributes.id;
        this.attributes = machineAttributes
        machineDB.insertMachine(this);
    }

    addNumberAttribute(key, value) {
        if (!key || !value) throw new Error("The key or value for a machine attribute cannot be null.")
        this.addAttribute[key] = parseInt(value);
    }

    addStringAttribute(key, value) {
        if (!key || !value) throw new Error("The key or value for a machine attribute cannot be null.")
        this.attributes[key] = value + "";
    }
}
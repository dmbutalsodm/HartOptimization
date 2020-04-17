const Uuid = require('../UuidGenerator.js');

// Represents a physical machine.
module.exports = class Machine {
    attributes = {};
    id;

    constructor(machineAttributes) {
        this.id = machineAttributes.id || Uuid.getPrefixedSnowflake("m");
        delete machineAttributes.id
        this.attributes = machineAttributes
    }

    addAttribute(tag, value) {
        if (!tag || !value) throw new Error("The tag or value for a machine attribute cannot be null.")
        this.addAttribute[tag] = value
    }
}
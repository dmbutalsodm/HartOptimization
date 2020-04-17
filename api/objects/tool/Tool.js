const Uuid = require('../UuidGenerator.js');

// Represents a physical tool that can be inserted into a machine and perform an op.
module.exports = class Tool {
    attributes = {};
    id;

    constructor(toolAttributes) {
        this.id = toolAttributes.id || Uuid.getPrefixedSnowflake("t");
        this.machine = toolAttributes.machine
        delete toolAttributes.machine;
        delete toolAttributes.id;
        this.attributes = toolAttributes
    }

    addAttribute(tag, value) {
        if (tag || !value) throw new Error("The tag or value for a tool attribute cannot be null.")
        this.addAttribute[tag] = value
    }
}
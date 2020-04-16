const Uuid = require('../UuidGenerator.js');

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
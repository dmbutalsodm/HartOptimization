module.exports = class Tool {
    constructor(toolAttributes) {
        this.id = toolAttributes.id;
        delete toolAttributes.id;
        this.attributes = toolAttributes;
    }

    addNumberAttribute(key, value) {
        if (!key || !value) throw new Error("The key or value for a tool attribute cannot be null.")
        this.addAttribute[key] = parseInt(value);
    }

    addStringAttribute(key, value) {
        if (!key || !value) throw new Error("The key or value for a tool attribute cannot be null.")
        this.attributes[key] = value + "";
    }
}
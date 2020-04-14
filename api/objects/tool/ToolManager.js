const Tool = require('./Tool');

module.exports = class ToolManager {
    constructor() {
        this.tools = [];
    }

    getTools() {
        return this.tools;
    }

    getTool(id) {
        for (const tool of this.tools) if (tool.id == id) return tool;
        return null;
    }

    addTool(toolDetails) {
        this.tools.push(new Tool(toolDetails))
    }
}
const Tool = require('./Tool.js');

class ToolManager {
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
        if (this.getTool(toolDetails.id)) throw new Error("A tool with that ID already exists in the library.")
        // Tool constructor takes care of adding itself to the database
        const newTool = new Tool(toolDetails);
        this.tools.push(newTool)
        return newTool;
    }

    getOrCreateTool(id) {
        const toolTest = this.getTool(id);
        if (toolTest) return toolTest;
        return this.addTool({id: id})
    }
}

module.exports = new ToolManager();
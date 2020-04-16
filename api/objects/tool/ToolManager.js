const Tool = require('./Tool.js');
const toolDB = require('../../models/tool.js')

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

    getToolByName(name) {
        for (const t of this.tools) if (t.attributes.name == name) return t;
        return null;
    }

    addTool(toolDetails) {
        if (this.getToolByName(toolDetails.name)) throw new Error("A tool by the name '" + toolDetails.name + "' already exists.")
        const newTool = new Tool(toolDetails);
        this.tools.push(newTool)
        toolDB.insertTool(newTool);
        return newTool;
    }

    getOrCreateTool(id) {
        const toolTest = this.getTool(id);
        if (toolTest) return toolTest;
        return this.addTool({id: id})
    }
}

const single =  new ToolManager();
module.exports = single;
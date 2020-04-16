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

    getOrCreateTool(id, machine) {
        const toolTest = this.getTool(id);
        if (toolTest) return toolTest;
        return this.addTool({id: id, machine: machine})
    }

    assignToolsToMachine(machineID, toolIDArray) {
        // Machine ID is verified before it is passed in, so we do not need to verify it ourselves.
        let names = [];
        toolIDArray.forEach(tid => {
            // If the provided tool ID is invalid, fail silently.
            let tTest = this.getTool(tid)
            if (tTest) {
                names.push(tTest.attributes.name);
                toolDB.insertToolIntoMachine(tid, machineID);
            }
        });
        return names;
    }

    freeTools(toolIDArray) {
        let names = [];
        toolIDArray.forEach(tid => {
            // If the provided tool ID is invalid, fail silently.
            let tTest = this.getTool(tid)
            if (tTest) {
                tTest.machine = null;
                names.push(tTest.attributes.name);
                toolDB.freeTool(tid);
            }
        });
        return names;
    }
}

const single =  new ToolManager();
module.exports = single;
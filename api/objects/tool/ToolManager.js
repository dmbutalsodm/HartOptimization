const Tool = require('./Tool.js');
const toolDB = require('../../models/tool.js')

// Holds all tools and manages their info.
class ToolManager {
    constructor() {
        this.tools = [];
    }

    deleteTool(id) {
        let ind = -1;
        for (let i = 0; i < this.tools.length; i++) {
            if (this.tools[i].id == id) {
                ind = i;
                break;
            }
        }
        this.tools.splice(ind, 1);

        toolDB.deleteTool(id);
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
        // Adds a new tool to the database.
        toolDB.insertTool(newTool);
        return newTool;
    }

    // For rebuilding the tool cache on launch.
    getOrCreateTool(id, machine) {
        const toolTest = this.getTool(id);
        if (toolTest) return toolTest;
        return this.addTool({id: id, machine: machine})
    }

    // Populates the machine attribute with the machine the tool is in. 
    assignToolsToMachine(machineId, toolIDArray) {
        // Machine ID is verified before it is passed in, so we do not need to verify it ourselves.
        let names = [];
        toolIDArray.forEach(tid => {
            // If the provided tool ID is invalid, fail silently.
            let tTest = this.getTool(tid)
            if (tTest) {
                names.push(tTest.attributes.name);
                tTest.machine = machineId
                toolDB.insertToolIntoMachine(tid, machineId);
            }
        });
        return names;
    }

    // Clear machine attribute
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
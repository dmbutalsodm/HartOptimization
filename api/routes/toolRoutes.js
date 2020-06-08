const toolManager = require('../objects/tool/ToolManager.js')
const toolDB = require('../models/tool.js');

module.exports = {
    registerToolPaths: (app) => {
        app.get('/api/', (req, res) => {
            res.send("pong!");
            return;
        })
        
        app.get('/api/tools', (req, res) => {
            res.json(toolManager.getTools());
        })
        
        app.get('/api/tools/:id(t[0-9]+)', (req, res) => {
            res.json(toolManager.getTool(req.params.id));
        })
        
        // Add a new tool to the database
        app.post('/api/tools/', (req, res) => {
            if (!req.body.name) return res.json({status: "error", message: "The 'name' field is required in the request body."});
            if (!req.body.pockets) return res.json({status: "error", message: "The 'pockets' field is required in the request body."});
            if (!parseInt(req.body.pockets)) return res.json({status: "error", message: "The 'pockets' field is required to be an integer"});
            if (!(parseInt(req.body.pockets) > 0)) return res.json({status: "error", message: "The 'pockets' field is required to be an integer greater than 0"});
            
            let toolName = req.body.name // separate variable because tool deletes toolattributes.id
            let newT;
            try {
                newT = toolManager.addTool(req.body);
            } catch (e) {
                return res.json({status: "error", message: e.message})
            }
            return res.json({status: "ok", message: `The tool with the name '${toolName}' has been added`, id: newT.id}) 
        })

        // Remove tools from their respective machines.
        app.post('/api/tools/freeTools', (req, res) => {
            if (!req.body.tools  || !req.body.tools.length) return res.json({status: "error", message: "Invalid tool list."});
            let names = toolManager.freeTools(req.body.tools);
            return res.json({status: "ok", message: `The following tools have been removed from machines: ${names.join(", ")}`})
        })

        app.post('/api/tools/delete', (req, res) => {
            toolManager.deleteTool(req.body.toolId).then(() => {
                res.json({status: "ok", message: "The tool was deleted."});
            })
        })
    }
}
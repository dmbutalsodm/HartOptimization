const toolManager = require('../objects/tool/ToolManager.js')
const toolDB = require('../models/tool.js');

module.exports = {
    registerToolPaths: (app) => {
        app.get('/api/', (req, res) => {
            res.send("This is the API landing.");
            return;
        })
        
        app.get('/api/tools', (req, res) => {
            res.json(toolManager.getTools());
        })
        
        app.get('/api/tools/:id', (req, res) => {
            res.json(toolManager.getTool(req.params.id));
        })
        
        app.post('/api/tools/', (req, res) => {
            if (!req.body.name) return res.json({status: "error", message: "The 'name' field is required in the request body."});
            let toolName = req.body.name // separate variable because tool deletes toolattributes.id
            try {
                toolManager.addTool(req.body);
            } catch (e) {
                return res.json({status: "error", message: e.message})
            }
            return res.json({status: "ok", message: `The tool with the name '${toolName}' has been added`}) 
        })

        app.post('/api/tools/freeTools', (req, res) => {
            if (!req.body.tools  || !req.body.tools.length) return res.json({status: "error", message: "Invalid tool list."});
            let names = toolManager.freeTools(req.body.tools);
            return res.json({status: "ok", message: `The following tools have been removed from machines: ${names.join(", ")}`})
        })
    }
}
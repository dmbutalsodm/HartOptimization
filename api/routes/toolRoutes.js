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
            if (!req.body.id) return res.json({status: "error", message: "No tool ID was provided in the request body."});
            // Potential required parameter check other than ID here if necessary.
            let toolID = req.body.id // separate variable because tool deletes toolattributes.id
            if (toolID[0] !== "t") return res.json({status: "error", message: "The tool's ID must start with a lowercase t."}); // Future: maybe auto gen IDs
            try {
                toolManager.addTool(req.body);
            } catch (e) {
                return res.json({status: "error", message: e.message})
            }
            return res.json({status: "ok", message: `The tool with the id ${toolID} has been added`}) 
        })
    }
}
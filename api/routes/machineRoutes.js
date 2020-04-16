const machineManager = require('../objects/machine/MachineManager.js')
const machineDB = require('../models/machine.js');

module.exports = {
    registerMachinePaths: (app) => {
        
        app.get('/api/machines', (req, res) => {
            res.json(machineManager.getMachines());
        })
        
        app.get('/api/machines/:id', (req, res) => {
            res.json(machineManager.getMachine(req.params.id));
        })
        
        app.post('/api/machines/', (req, res) => {
            if (!req.body.name) return res.json({status: "error", message: "The 'name' field is required in the request body."});
            let machineName = req.body.name // separate variable because machine deletes machineattributes.id
            try {
                machineManager.addMachine(req.body);
            } catch (e) {
                return res.json({status: "error", message: e.message})
            }
            return res.json({status: "ok", message: `The machine with the name '${machineName}' has been added`}) 
        })

        app.post('/api/machines/:id/addTools', (req, res) => {
            const selectedMachine = machineManager.getMachine(req.params.id);
            if (!selectedMachine) return res.json({status: "error", message: "There is no machine by the id provided."});
            const toolManager = require('../objects/tool/ToolManager.js')
            if (!req.body.tools || !req.body.tools.length) return res.json({status: "error", message: "Invalid tool list."});
            let loaded = toolManager.assignToolsToMachine(req.params.id, req.body.tools);
            res.json({status: "ok", message: `The following tools were loaded into '${selectedMachine.attributes.name}': ${loaded.join(", ")}`});
        });
    }
}
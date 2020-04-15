const machineManager = require('../objects/machine/machineManager.js')
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
            if (!req.body.id) return res.json({status: "error", message: "No machine ID was provided in the request body."});
            // Potential required parameter check other than ID here if necessary.
            let machineID = req.body.id // separate variable because machine deletes machineattributes.id
            if (machineID[0] !== "m") return res.json({status: "error", message: "The machine's ID must start with a lowercase m."}); // Future: maybe auto gen IDs
            try {
                machineManager.addMachine(req.body);
            } catch (e) {
                return res.json({status: "error", message: e.message})
            }
            return res.json({status: "ok", message: `The machine with the id ${machineID} has been added`}) 
        })
    }
}
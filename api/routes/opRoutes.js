const machineManager = require('../objects/machine/MachineManager.js')
const toolManager    = require('../objects/tool/ToolManager.js');
const opManager     = require('../objects/op/OpManager.js')
const partManager     = require('../objects/part/PartManager.js')

module.exports = {
    registerOpPaths: (app) => {
        app.post('/api/ops', async (req, res) => {
            // Verify arguments exist
            if (!req.body.name      || !req.body.name.length)         return res.json({status: "error", message: "Job name is not present"})
            if (!req.body.machines  || !req.body.machines.length)     return res.json({status: "error", message: "Machines list is not present"})
            if (!req.body.tools     || !req.body.tools.length)        return res.json({status: "error", message: "Tools list is not present"})
            if (!req.body.part)                                       return res.json({status: "error", message: "Parent part is not present"})
            if (!req.body.opCode    || !parseInt(req.body.opCode))    return res.json({status: "error", message: "Op code is not present"})
            if (!req.body.intervals || !parseInt(req.body.intervals)) return res.json({status: "error", message: "Intervals is not present"})

            // Validate arguments against exsting ops/machines/tools
            let passing = true;
            
            // TODO: Create new validation scheme
            // if (await opManager.opNameExists(req.body.name)) return res.json({status: "error", message: "An op by that name already exists."})

            req.body.machines.forEach(m => {
                if (!machineManager.getMachine(m)) passing = false;
            })
            if (!passing) return res.json({status: "error", message: "An invalid machine ID was provided."});
            
            req.body.tools.forEach(m => {
                if (!toolManager.getTool(m)) passing = false;
            })
            if (!passing) return res.json({status: "error", message: "An invalid tool ID was provided."});

            if (!await partManager.partExists(req.body.part)) return res.json({status: "error", message: "An invalid parent part ID was provided."});

            // All arguments valid, create the op.
            return opManager.createNewOp(req.body.name, req.body.opCode, req.body.machines, req.body.tools, req.body.part, req.body.intervals).then(id => {
                return res.json({status: "ok", message: `The op was added to the the part ${req.body.part}`, id: id}); 
            })
            
        })

        app.post('/api/ops/updatetools', (req, res) => {
            if (!req.body.opId)                            return res.json({status: "error", message: "No op id was present."})
            if (!req.body.toAdd && !req.body.toDelete)   return res.json({status: "error", message: "No valid tool lists were provided."});

            return opManager.updateOpTools(req.body.opId, req.body.toDelete || [], req.body.toAdd || []).then(() => {
                res.json({status: "ok", message: "The op was updated."});
            })
        })

        app.post('/api/ops/updatemachines', (req, res) => {
            if (!req.body.opId)                            return res.json({status: "error", message: "No op id was present."})
            if (!req.body.toAdd && !req.body.toDelete)   return res.json({status: "error", message: "No valid tool lists were provided."});

            return opManager.updateOpMachines(req.body.opId, req.body.toDelete || [], req.body.toAdd || []).then(() => {
                res.json({status: "ok", message: "The op was updated."});
            })
        })

        app.get('/api/ops/:id', (req, res) => {
            opManager.getOp(req.params.id).then(r => {
                res.json(r);
            })
        })
    }
}
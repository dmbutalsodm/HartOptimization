const machineManager = require('../objects/machine/MachineManager.js')
const toolManager    = require('../objects/tool/ToolManager.js');
const opManager     = require('../objects/op/OpManager.js')

module.exports = {
    registerOpPaths: (app) => {
        app.post('/api/ops/create', async (req, res) => {
            // Verify arguments exist
            if (!req.body.name     || !req.body.name.length)     return req.json({status: "error", message: "Job name is not present"})
            if (!req.body.machines || !req.body.machines.length) return req.json({status: "error", message: "Machines list is not present"})
            if (!req.body.tools    || !req.body.tools.length)    return req.json({status: "error", message: "Tools list is not present"})

            // Validate arguments against exsting ops/machines/tools
            let passing = true;
            if (await opManager.opNameExists(req.body.name)) return res.json({status: "error", message: "An op by that name already exists."})

            req.body.machines.forEach(m => {
                if (!machineManager.getMachine(m)) passing = false;
            })
            if (!passing) return res.json({status: "error", message: "An invalid machine ID was provided."});
            req.body.tools.forEach(m => {
                if (!toolManager.getTool(m)) passing = false;
            })
            if (!passing) return res.json({status: "error", message: "An invalid tool ID was provided."});

            // All arguments valid, create the op.
            opManager.createNewOp(req.body.name, req.body.machines, req.body.tools);
            return res.json({status: "ok", message: "The op was added to the the part ***."})
        })
    }
}
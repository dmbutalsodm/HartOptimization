const machineManager = require('../objects/machine/MachineManager.js')
const toolManager    = require('../objects/tool/ToolManager.js');
const jobManager     = require('../objects/job/JobManager.js')

module.exports = {
    registerJobPaths: (app) => {
        app.post('/api/jobs/create', (req, res) => {
            // Verify arguments exist
            if (!req.body.name     || !req.body.name.length)     return req.json({status: "error", message: "Job name is not present"})
            if (!req.body.machines || !req.body.machines.length) return req.json({status: "error", message: "Machines list is not present"})
            if (!req.body.tools    || !req.body.tools.length)    return req.json({status: "error", message: "Tools list is not present"})

            // Validate arguments against exsting jobs/machines/tools
            let passing = true;

            if (jobManager.jobNameExists(req.body.name)) return res.json({status: "error", message: "A job by that name already exists."})

            req.body.machines.forEach(m => {
                if (!machineManager.getMachine(m)) passing = false;
            })
            if (!passing) return res.json({status: "error", message: "An invalid machine ID was provided."});
            req.body.tools.forEach(m => {
                if (!toolManager.getTool(m)) passing = false;
            })
            if (!passing) return res.json({status: "error", message: "An invalid tool ID was provided."});
            jobManager.createNewJob(req.body.name, req.body.machines, req.body.tools);
            return res.json({status: "ok", message: "The empty job was added to the database. It can now be instantiated."})
        })
    }
}
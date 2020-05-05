const jobManager = require('../objects/job/JobManager.js');
const jobDB = require('../models/job.js');

module.exports = {
    registerPartPaths: (app) => {
        app.post('/api/jobs', (req, res) => {
            if (!req.body.partId)                                                                       return res.json({status: "error", message: "The partId field is required in the post body."})
            if (!req.body.partCount || !parseInt(req.body.partCount))                                   return res.json({status: "error", message: "The partCount field is required in the post body."})
            if (!req.body.name)                                                                         return res.json({status: "error", message: "The name field is required in the post body."})
            if (!req.body.startDate || !/20[0-9]{2}[-][012][0-9][-][0123][0-9]/.test(req.body.startDate)) return res.json({status: "error", message: "The startDate field is required in the post body, or the provided date was invalid."})
            // Eventually priority check

            return jobManager.addNewJob(req.body.partId, req.body.partCount, req.body.name, req.body.startDate, 0).then((id) => {
                res.json({status: "ok", message: "The job was added."});
            })
        });

        app.get('/api/jobs', async (req, res) => {
            res.json(await jobManager.getJobs());
        });

        app.post('/api/jobs/:id/updatepriority', async (req, res) => {
            if (!req.body.jobId)    return res.json({status: "error", message: "The jobId field is required in the post body."})
            if (!req.body.priority) return res.json({status: "error", message: "The priority field is required in the post body."})
            return jobManager.updatePriority(req.body.jobId, req.body.priority).then(() => {
                return res.json({status: "ok", message: "The priority was updated."});
            })          
        });
    }
}
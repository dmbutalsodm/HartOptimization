let Uuid = require('../UuidGenerator.js');
let jobDB = require('../../models/job.js');
let jobMachinesDB = require('../../models/jobMachines.js');
let jobToolsDB = require('../../models/jobTools.js')

class JobManager {
    jobs = [];

    createNewJob(jobName, machineArray, toolArray) {
        let jobId = Uuid.getPrefixedSnowflake("j");
        jobDB.addNewEmptyJob(jobName, jobId);

        toolArray.forEach(async toolId => {
            return jobToolsDB.addJobTool(jobId, toolId);
        });

        machineArray.forEach(async machineId => {
            return jobMachinesDB.addJobMachine(jobId, machineId);
        });
    }

    async jobNameExists(jobName) {
        return jobDB.jobNameExists(jobName);
    }
}

const single = new JobManager();
module.exports = single; 
let Uuid = require('../UuidGenerator.js');
let jobDB = require('../../models/job.js');
let jobMachinesDB = require('../../models/jobMachines.js');
let jobToolsDB = require('../../models/jobTools.js')

// Class for coordinating jobs and their information.
class JobManager {
    jobs = [];

    // Function responsible for sending job information to the proper db tables.
    createNewJob(jobName, machineArray, toolArray) {
        // Jobs are not represented in memory, so we can generate a new ID on creation.
        let jobId = Uuid.getPrefixedSnowflake("j");

        // Sends to the job table with the minimum info required to make a template.
        jobDB.addNewEmptyJob(jobName, jobId);

        // Add each tool to the jobTools table, job needs tool toolId
        toolArray.forEach(async toolId => {
            return jobToolsDB.addJobTool(jobId, toolId);
        });

        // same for machines/jobMachines
        machineArray.forEach(async machineId => {
            return jobMachinesDB.addJobMachine(jobId, machineId);
        });
    }

    // For dupe checking
    async jobNameExists(jobName) {
        return jobDB.jobNameExists(jobName);
    }
}

const single = new JobManager();
module.exports = single; 
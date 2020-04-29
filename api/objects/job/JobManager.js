const jobDB = require('../../models/job.js');
const Uuid = require('../UuidGenerator.js');

class JobManager {
    async addNewJob(partId, partCount, name, dueDate, priority) {
        const jobId = Uuid.getPrefixedSnowflake("j");
        return jobDB.addJob(jobId, partId, partCount, name, dueDate, priority)
    }

    async getJobs() {
        return jobDB.getJobs();
    }

    async updatePriority(id, prio) {
        return jobDB.updatePriority(id, prio);
    }
}

module.exports = new JobManager();
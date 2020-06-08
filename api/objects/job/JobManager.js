const jobDB = require('../../models/job.js');
const Uuid = require('../UuidGenerator.js');

class JobManager {
    async addNewJob(partId, partCount, name, startDate, priority) {
        const jobId = Uuid.getPrefixedSnowflake("j");
        return jobDB.addJob(jobId, partId, partCount, name, startDate, priority)
    }

    async getJobs() {
        return jobDB.getJobs();
    }

    async updatePriority(id, prio) {
        return jobDB.updatePriority(id, prio);
    }

    async deleteJob(id) {
        return jobDB.deleteJob(id);
    }
}

module.exports = new JobManager();
const scheduleManager = require('../objects/schedule/ScheduleManager.js');

module.exports = {
    registerSchedulePaths: (app) => {
        app.get('/api/scheduling', async (req, res) => {
            res.json(await scheduleManager.generatePrelimSchedule());
        })
    }
}
const scheduleManager = require('../objects/schedule/ScheduleManager.js');

module.exports = {
    registerSchedulePaths: (app) => {
        app.get('/api/scheduling', async (req, res) => {
            scheduleManager.generatePrelimSchedule().then(r => {
                res.json(r);
            }).catch(e => {
                console.log(e)
                res.status(501).json({status: "error"})
            })
            
        })
    }
}
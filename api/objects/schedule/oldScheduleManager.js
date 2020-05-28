const jobManager = require('../job/JobManager.js');
const machineManager = require('../machine/MachineManager.js');
const partManager = require('../part/PartManager.js');

const INTERVALS_PER_DAY = 32;

class ScheduleManager {
    generateEmptySchedule() {
        let r = {};
        let mids = machineManager.getMachines().map((m) => m.id);
        mids.forEach(m => r[m] = []);
        return r;
    }

    daysFromToday(inputDay) {
        return Math.ceil((new Date(new Date(inputDay).getTime() + 43200000) - Date.now()) / 1000 / 60 / 60 / 24)
    }

    generateProductionArray(jobId, balance, intervalsPerPart) {
        const partsPerDay = Math.floor(INTERVALS_PER_DAY / intervalsPerPart);
        if (!partsPerDay) partsPerDay = 1;
        const dailies = [];
        // Balance represents the parts that still need to be made at the beginning of the day.
        while (balance > 0) {
            dailies.push([jobId, balance, partsPerDay]);
            balance -= partsPerDay;
        }
        return dailies;
    }

    selectBestMachine(usableMachines, machinePopularities) {
        let currMin = 10000
        let currMinMachine = null;
        for (let possibleMachine of usableMachines) {
            if (!machinePopularities[usableMachines]) machinePopularities[usableMachines] = 0;
            if ( machinePopularities[usableMachines] < currMin) {
                currMin = machinePopularities[usableMachines];
                currMinMachine = possibleMachine;
            }
        }
        return currMinMachine;
    }

    canSchedule(currSchedule, targetMachine, productionArray, startDate) {
        let targetSchedule = currSchedule[targetMachine];
        let startPos = this.daysFromToday(startDate);
        let endPos = startPos + productionArray.length;
        for (let i = startPos + 1; i <= endPos; i++) if (targetSchedule[i] != null) return false;
        return true;
    }

    schedule(currSchedule, targetMachine, productionArray, startDate) {
        let targetSchedule = currSchedule[targetMachine];
        let startPos = typeof startDate == "string" ? this.daysFromToday(startDate) : startDate;
        let endPos = startPos + productionArray.length;
        let c = 0;
        for (let i = startPos; i < endPos; i++) {
            targetSchedule[i] = productionArray[c];
            c += 1;
        }
    }

    getNextStartDate(schedule, startDate, j) {
        let s = this.daysFromToday(startDate);
        while (schedule[s]) s += 1;
        return s;
    }

    async generatePrelimSchedule() {
        const machinePopularities = await machineManager.getMachinePopularities();
        const schedule = this.generateEmptySchedule();
        // Jobs come in arranged in highest priority, i.e. in correct order.
        const jobs = await jobManager.getJobs();
        for (let job of jobs) {
            const part = await partManager.getPart(job.partId);
            job.prodArray = this.generateProductionArray(job.id, job.partCount, part.intervals);
            job.machines = part.machines;
        }
        jobs.forEach((j) => {
            let ableToSchedule = false;
            let jMachines = j.machines.slice();
            while (!ableToSchedule && jMachines.length) {
                let bestMachine = this.selectBestMachine(jMachines, machinePopularities);
                if (this.canSchedule(schedule, bestMachine, j.prodArray, j.startDate)) {
                    ableToSchedule = true;
                    this.schedule(schedule, bestMachine, j.prodArray, j.startDate)
                } else {
                    jMachines.splice(jMachines.indexOf(bestMachine), 1);
                }
            }
            if (!ableToSchedule) {
                let bestMachine = this.selectBestMachine(j.machines, machinePopularities);
                this.schedule(schedule, bestMachine, j.prodArray, this.getNextStartDate(schedule[bestMachine], j.startDate, j));
                machinePopularities[bestMachine] += 2;
            }
        })
        return schedule;
    }
}

module.exports = new ScheduleManager();
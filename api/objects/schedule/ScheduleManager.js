const jobManager = require('../job/JobManager.js');
const machineManager = require('../machine/MachineManager.js');
const partManager = require('../part/PartManager.js');
const Uuid = require('../UuidGenerator.js');

const INTERVALS_PER_DAY = 32;
const colors = [
    '#0066ff',
    '#9900cc',
    '#00cc00',
    '#000066',
    '#0099cc',
    '#cc6600',
    '#ff00ff',
    '#00cc66',
    '#3366cc',
    '#993366',
    '#3366ff',
    '#4d0019'
]

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

    dateToIntervalsFromNow(inputDay) {
        return Math.ceil((new Date(inputDay).getTime() - Date.now()) / 900000) // 900000 is 15 minutes
    }

    intersectArray(a1, a2) {
        return a1.filter(value => -1 !== a2.indexOf(value))
    }

    unionArray(a1, a2) {
        return Array.from(new Set([...a1, ...a2]));
    }

    generateProductionArray(opId, balance, intervalsPerPart, opName, jobName, jobId, inBetweenOffset, color) {
        const intervals = [];
        // Balance represents the parts that still need to be made at the beginning of the day.
        for (let prodNum = 0; prodNum < balance; prodNum++) {
            let thisOp = Uuid.getSnowflake();
            for (let i = 0; i < intervalsPerPart; i++) {
                // [opId, thisOp, balance - prodNum, opName]
                intervals.push({
                    opId: opId,
                    opUuid: thisOp,
                    balance: balance - prodNum,
                    opName: opName,
                    jobName: jobName,
                    jobId: jobId,
                    color: color,
                });
            }
            for (let i = 0; i < inBetweenOffset; i++) {
                intervals.push({
                    opId: "PLACEHOLDER",
                    opUuid: 0,
                    opName: "",
                    jobName: jobName
                });
            }
        }
        return intervals;
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

    canSchedule(currSchedule, targetMachine, productionArray, startDate, dateOffset) {
        let targetSchedule = currSchedule[targetMachine];
        let startPos = this.dateToIntervalsFromNow(startDate) + dateOffset;
        let endPos = startPos + productionArray.length + dateOffset;
        for (let i = startPos + 1; i <= endPos; i++) if (targetSchedule[i] != null) return false;
        return true;
    }

    schedule(currSchedule, targetMachine, productionArray, startDate, dateOffset) {
        let targetSchedule = currSchedule[targetMachine];
        let startPos = typeof startDate == "string" ? this.dateToIntervalsFromNow(startDate) + dateOffset : startDate;
        let endPos = startPos + productionArray.length + dateOffset;
        let c = 0;
        for (let i = startPos; i < endPos; i++) {
            targetSchedule[i] = productionArray[c];
            c += 1;
        }
    }

    getNextStartDate(schedule, startDate) {
        let s = this.dateToIntervalsFromNow(startDate); 
        while (schedule[s]) s += 1;
        return s;
    }

    generateInitialOffset(opArray, currentOp) {
        let offset = 0;
        for (let i = 0; i < opArray.length; i++) {
            if (opArray[i] == currentOp) return offset;
            offset += opArray[i].intervals
        }
    }

    generateMiddleOffset(opArray, currentOp) {
        let offset = 0;
        if (opArray[0] == currentOp) return offset;
        for (let i = 1; i < opArray.length; i++) {
            if (opArray[i - 1].holds) {
                offset = (opArray[i - 1].intervals + opArray[i - 1].holds) - opArray[i].intervals
            } else offset = opArray[i - 1].intervals - opArray[i].intervals
            if (offset < 0) offset = 0;
            if (opArray[i] == currentOp) {
                opArray[i].holds = offset;
                return offset;
            }
        }
    }

    async generatePrelimSchedule() {
        let o = Date.now();
        const machinePopularities = await machineManager.getMachinePopularities();
        const schedule = this.generateEmptySchedule();
        // Jobs come in arranged in highest priority, i.e. in correct order.
        const jobs = await jobManager.getJobs();
        let opGroupings = [];
        for (let job of jobs) {
            const part = await partManager.getPart(job.partId);
            opGroupings.push({
                job: job,
                startDate: job.startDate,
                count: job.partCount,
                ops: part.ops,
            });
        }
        for (let opGroup of opGroupings) { // combines sequential ops into 1 op
            for (let i = 0; i < opGroup.ops.length; i++) {
                if (opGroup.ops[i].isSequential) {
                    let o1 = opGroup.ops[i]
                    let o2 = opGroup.ops[i + 1];
                    if (!o2) continue;
                    opGroup.ops.splice(i+1, 1); // removes op2 from the array
                    o1.opId      = o1.opId + "|" + o2.opId;
                    o1.intervals = parseInt(o1.intervals) + parseInt(o2.intervals);
                    o1.opName    = o1.opName + " and " + o2.opName;
                    o1.machines  = this.intersectArray(o1.machines, o2.machines); // Can only be completed in common machines
                    o1.tools     = this.unionArray(o1.tools, o2.tools); // Needs all the tools that either op needs.
                    o1.isSequential = o2.isSequential
                    i -= 1;
                }
            }
        }
        
        for (let opGroup of opGroupings) {
            let color = colors[parseInt(opGroup.job.id.substring(1)) % colors.length]
            for (let i = 0; i < opGroup.ops.length; i++) {
                opGroup.ops[i].prodArray = this.generateProductionArray(
                    opGroup.ops[i].opId,
                    opGroup.count,
                    opGroup.ops[i].intervals,
                    opGroup.ops[i].opName,
                    opGroup.job.name,
                    opGroup.job.id,
                    this.generateMiddleOffset(opGroup.ops, opGroup.ops[i]),
                    color
                );
            }
        }
        
        for (let opGroup of opGroupings) {
            let currOps = opGroup.ops
            for (let i = 0; i < currOps.length; i++) {
                let ableToSchedule = false;
                let opMachines = currOps[i].machines.slice();
                while (!ableToSchedule && opMachines.length) {
                    let bestMachine = this.selectBestMachine(opMachines, machinePopularities);
                    if (this.canSchedule(schedule, bestMachine, currOps[i].prodArray, opGroup.startDate, this.generateInitialOffset(currOps, currOps[i]))) {
                        ableToSchedule = true;
                        this.schedule(schedule, bestMachine, currOps[i].prodArray, opGroup.startDate, this.generateInitialOffset(currOps, currOps[i]))
                        machinePopularities[bestMachine] += 1;
                    } else {
                        opMachines.splice(opMachines.indexOf(bestMachine), 1); 
                    }
                }
                if (!ableToSchedule) {
                    let opMachines = currOps[i].machines.slice();
                    let currMin = 10000000;
                    let bestMachine = null;
                    /* EXIT CONDITION FOR IMPOSSIBLE TO SCHEDULE - NO MACHINES POSSIBLE FOR OPS */ 
                    if (!opMachines.length) throw {name: 'opMachinesError', partId: opGroup.job.partId};
                    opMachines.forEach(m => {
                        let cv = this.getNextStartDate(schedule[m], opGroup.startDate);     
                        if (cv < currMin) {
                            currMin = cv;
                            bestMachine = m;
                        }
                    });
                    this.schedule(schedule, bestMachine, currOps[i].prodArray, this.getNextStartDate(schedule[bestMachine], opGroup.startDate), this.generateInitialOffset(currOps, currOps[i]));
                    machinePopularities[bestMachine] += 2;
                }
            }  
        }
        
        return schedule;
    }
}

module.exports = new ScheduleManager();
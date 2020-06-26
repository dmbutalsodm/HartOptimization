const partDB = require('../../models/part.js');
const Uuid = require('../UuidGenerator.js');
const opDB = require('../../models/op.js')
const jobDB = require('../../models/job.js')

class PartManager {
    async addNewPart(partName) {
        const partId = Uuid.getPrefixedSnowflake("p");
        return partDB.addPart(partId, partName).then(() => partId)
    }

    async partExists(partId) {
        return partDB.partExists(partId);
    }

    async getAllPartIds() {
        return partDB.getAllPartIds();
    }

    async getPart(id) {
        return Promise.all([opDB.getPartOps(id), partDB.getPart(id)]).then(values => {
            const ops = values[0]
            let pTime = 0;
            let pMachines = new Set();
            let pTools = new Set();
            for (let o of ops) {
                pTime += o.intervals;
                if (o.machines) o.machines.forEach(mac => pMachines.add(mac));
                if (o.tools) o.tools.forEach(mac => pTools.add(mac));
            }
            return {partId: id, partName: values[1].partName, ops: ops, intervals: pTime, tools: Array.from(pTools), machines: Array.from(pMachines)}
        })
    }

    async getAllParts() {
        return this.getAllPartIds().then(async ids => {
            let ret = [];
            for (let id of ids) {
                const ops = await opDB.getPartOps(id);
                // TOOL FOR OPS ARE SOMETIMES NOT PRESENT BY HERE - FIXED?
                let pTime = 0;
                let pMachines = new Set();
                let pTools = new Set();
                for (let o of ops) {
                    o.machines = o.machines || [];
                    o.tools = o.tools || [];
                    pTime += o.intervals;
                    o.machines.forEach(mac => pMachines.add(mac));
                    o.tools.forEach(mac => pTools.add(mac));
                }
                ret.push({partId: id, partName: (await this.getPart(id)).partName, ops: ops, intervals: pTime, tools: Array.from(pTools), machines: Array.from(pMachines)});
            }
            return ret;
        })
    }

    async deletePart(partId) {
        let p = await this.getPart(partId);
        partDB.deletePart(partId)
        p.ops.forEach(o => {
            console.log(o.opId);
            opDB.deleteOp(o.opId);
        })
        jobDB.deleteJobsByPart(partId);
        return;
    }
}

module.exports = new PartManager();
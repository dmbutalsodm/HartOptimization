const Machine = require('./Machine.js');
const machineDB = require('../../models/machine.js')
const jobDB = require('../../models/job.js');
const partManager = require('../part/PartManager.js');

// Holds all machines, coordinates machines and their info.
class MachineManager {
    constructor() {
        this.machines = [];
    }

    getMachines() {
        return this.machines
    }

    getMachine(id) {
        for (const m of this.machines) if (m.id == id) return m;
        return null;
    }

    getMachineByName(name) {
        for (const m of this.machines) if (m.attributes.name == name) return m;
        return null;
    }

    addMachine(machineDetails) {
        if (this.getMachineByName(machineDetails.name)) throw new Error("A machine by the name '" + machineDetails.name + "' already exists.") //optimise
        const newMachine = new Machine(machineDetails);
        this.machines.push(newMachine)
        // Add a machine to the database.
        machineDB.insertMachine(newMachine);
        return newMachine;
    }

    // For building the cache.
    getOrCreateMachine(id) {
        const machineTest = this.getMachine(id);
        if (machineTest) return machineTest;
        return this.addMachine({id: id})
    }

    getMachinePopularities() {
        return jobDB.getActiveParts().then(async activeParts => {
            let machines = {};
            for (let partId of activeParts) {
                await partManager.getPart(partId).then(p => {
                    p.machines.forEach(m => machines[m] = (machines[m] ? machines[m] + 1 : 1));
                })
            }
            console.log(machines);
            return machines;
        })
    }
}

module.exports = new MachineManager();
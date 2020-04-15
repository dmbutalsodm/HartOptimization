const Machine = require('./Machine.js');

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

    addMachine(machineDetails) {
        if (this.getMachine(machineDetails.id)) throw new Error("A machine with that ID already exists in the library.")
        const newMachine = new Machine(machineDetails);
        this.machines.push(newMachine)
        return newMachine;
    }

    getOrCreateMachine(id) {
        const machineTest = this.getMachine(id);
        if (machineTest) return machineTest;
        return this.addMachine({id: id})
    }
}

module.exports = new MachineManager();
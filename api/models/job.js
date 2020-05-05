const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table holds machines and their attributes
const jobs = db.define('jobs', {
	id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    partId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    partCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {timestamps: false});

db.sync();


module.exports = {
    addJob(id, partId, partCount, name, startDate, priority) {
        if (!new Date(startDate).getTime()) throw new Error("The date passed was invalid");
        return jobs.create({id, partId, partCount, name, startDate: startDate, priority})
    },

    getJobs() {
        return jobs.findAll({order: db.literal('priority DESC')}).then((r) => {
            return r.map(j => j.get());
        })
    },

    updatePriority(id, newPrio) {
        jobs.update({priority: newPrio}, {where: {id: id}});
    }
}
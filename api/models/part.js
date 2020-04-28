const { Sequelize, DataTypes } = require('sequelize');
const Database = require('../db.js');

const db = Database.db;

// This table holds...parts.
const parts = db.define('parts', {
	partId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    partName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {timestamps: false});

db.sync();

module.exports = {
    async addPart(id, name) {
        return parts.create({
            partId: id,
            partName: name
        });
    },

    async getAllPartIds() {
        return parts.findAll().then(rows => {
            let ret = [];
            for (row of rows) {
                ret.push(row.get('partId'));
            }
            return ret;
        })
    },

    async getPart(id) {
        return parts.findOne({where: {partId: id}}).then(r => r ? r.get() : null);
    },

    async partExists(id) {
        return parts.findOne({
            where: {
                partId: id
            }
        }).then(modelOrNull => !!modelOrNull);
    }
}
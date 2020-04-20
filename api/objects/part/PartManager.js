const partDB = require('../../models/part.js');
const Uuid = require('../UuidGenerator.js');

class PartManager {
    async addNewPart(partName) {
        const partId = Uuid.getPrefixedSnowflake("p");
        return partDB.addPart(partId, partName).then(() => partId)
    }

    async partExists(partId) {
        return partDB.partExists(partId);
    }
}

module.exports = new PartManager();
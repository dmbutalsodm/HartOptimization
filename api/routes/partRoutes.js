const partManager = require('../objects/part/PartManager.js');
const opDB = require('../models/op');

module.exports = {
    registerPartPaths: (app) => {
        app.post('/api/parts', (req, res) => {
            if (!req.body.name) return res.json({status: "error", message: "The name field is required in the post body."})
            return partManager.addNewPart(req.body.name).then((id) => {
                res.json({status: "ok", message: "The part has been added. You may now add ops to it.", id: id});
            })
        });

        app.get('/api/parts/:id', (req, res) => {
            return Promise.all([opDB.getPartOps(req.params.id), partManager.getPart(req.params.id)]).then(values => {
                res.json({id: req.params.id, name: values[1].partName, ops: values[0]});
            })
        });

        app.get('/api/parts', (req, res) => {
            return partManager.getAllPartIds().then(async ids => {
                let ret = [];
                for (id of ids) {
                    ret.push({partId: id, name: (await partManager.getPart(id)).partName, ops: await opDB.getPartOps(id)})
                }
                res.json(ret);
            })
        });
    }
}
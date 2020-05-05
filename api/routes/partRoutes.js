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
            return partManager.getPart(req.params.id).then(v => {
                return res.json(v)
            });
        });

        app.get('/api/parts', (req, res) => {
            return partManager.getAllParts().then(p => {
                return res.json(p);
            })
        });
    }
}
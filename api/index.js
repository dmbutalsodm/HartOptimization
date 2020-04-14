const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const secrets = require('./secrets.js')
const db = require('./db.js');
db.start();

app.set('env', secrets.DEV_OR_PROD == "prod" ? "production" : "dev")
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json())

const ToolManager = require('./objects/tool/ToolManager.js');
const toolManager = new ToolManager();

app.get('/api/', (req, res) => {
    res.send("This is the API landing.");
    return;
})

app.get('/tools', (req, res) => {
    res.json(toolManager.getTools());
})

app.get('/tools/:id', (req, res) => {
    res.json(toolManager.getTool(req.params.id));
})

app.post('/tools/', (req, res) => {
    if (!req.body.id) return res.json({status: "error", message: "No tool ID was provided in the request body."});
    // Potential required parameter check other than ID here if necessary.
    toolManager.addTool(req.body);
    return res.json({status: "ok", message: `The tool with the id ${req.body.id} has been added`}) 
})

app.listen(3000, () => {
    console.log("The API is listening on localhost port 3000.")
})
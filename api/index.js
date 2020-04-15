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
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    next();
})

require('./routes/toolRoutes.js').registerToolPaths(app);
const tm = require('./objects/tool/ToolManager.js');
require('./models/tool').buildToolDatabase(tm)

require('./routes/machineRoutes.js').registerMachinePaths(app);
const mm = require('./objects/machine/MachineManager.js');
require('./models/machine').buildMachineDatabase(mm)

app.listen(3000, () => {
    console.log("The API is listening on localhost port 3000.")
})
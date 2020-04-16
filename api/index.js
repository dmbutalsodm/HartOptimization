const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const secrets = require('./secrets.js')
const db = require('./db.js');

db.start().then(async () => {
    require('./models/tool').buildToolDatabase()
    require('./routes/toolRoutes.js').registerToolPaths(app);

    require('./models/machine').buildMachineDatabase()
    require('./routes/machineRoutes.js').registerMachinePaths(app);
})

app.set('env', secrets.DEV_OR_PROD == "prod" ? "production" : "dev")

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    next();
})

app.listen(3000, () => {
    console.log("The API is listening on localhost port 3000.")
})
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const secrets = require('./secrets.js')
const db = require('./db.js');

// Once connected to the db...
db.start().then(async () => {
    // Build caches then register routes
    require('./models/tool').buildToolDatabase()
    require('./routes/toolRoutes.js').registerToolPaths(app);

    require('./models/machine').buildMachineDatabase()
    require('./routes/machineRoutes.js').registerMachinePaths(app);

    require('./routes/jobRoutes.js').registerJobPaths(app);
})

// For debugging messages on errors
app.set('env', secrets.DEV_OR_PROD == "prod" ? "production" : "dev")

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

// So the website can access the API without CORS errors.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    next();
})

app.listen(3000, () => {
    console.log("The API is listening on localhost port 3000.")
})
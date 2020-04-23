const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const secrets = require('./secrets.js')
const db = require('./db.js');

// Once connected to the db...
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


db.start().then(async () => {
    // Build caches then register routes
    require('./models/tool').buildToolDatabase()
    require('./routes/toolRoutes.js').registerToolPaths(app);

    require('./models/machine').buildMachineDatabase()
    require('./routes/machineRoutes.js').registerMachinePaths(app);

    require('./routes/opRoutes.js').registerOpPaths(app);

    require('./routes/partRoutes.js').registerPartPaths(app);
})

// For debugging messages on errors
app.set('env', secrets.DEV_OR_PROD == "prod" ? "production" : "dev")

// So the website can access the API without CORS errors.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})

app.listen(3000, () => {
    console.log("The API is listening on localhost port 3000.")
})
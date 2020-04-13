const express = require('express');
const app = express();

app.get('/api/', (req, res) => {
    res.send("This is the API landing.");
    return;
})

app.listen(3000, () => {
    console.log("Listening on localhost port 3000.")
})
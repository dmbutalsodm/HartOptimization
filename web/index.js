const express = require('express');
const request = require('request-promise')
const app = express();

app.get('/', (req, res) => {
    request('http://localhost:3000/api').then(b => {
        res.send(b);
    })
    return;
})

app.listen(80, () => {
    console.log("The WEBSERVER is listening on localhost port 80.");
})
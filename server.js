'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const serverController = require('./server.controller');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static('./build'));
app.use('/', express.static('subscribe.json'));
app.use('/node_modules', express.static('./node_modules'));


let subscribes = JSON.parse(fs.readFileSync('subscribe.json', 'utf8'));

app.post('/subscribes',  (req, res) => {
    serverController.refreshSubscribes(subscribes, req.body);
    res.send(subscribes);
});

app.get('/subscribes',  (req, res) => {
   res.send(subscribes);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

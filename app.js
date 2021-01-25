require('./models/db');
const express = require('express');
const bodyParser = require('body-parser');
const apiRoute = require('./api/RegisterUser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRoute);

app.listen(8080, () => "Server started on the http://localhost:8080");

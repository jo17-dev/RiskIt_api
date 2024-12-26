const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.port || 4567;

app.listen((req, res)=> {
    console.log("le serveur run sur le port "+port);
});
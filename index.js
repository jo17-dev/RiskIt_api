const express = require('express');
const bodyParser = require('body-parser');

const { createServer } = require('node:http');

const port = 500;
const app = express();
const httpServer = createServer(app);


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*'); // à modifier par un truc
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

// app.use(["/history/", "/lbank/", "/telegram/"], require("./src/middlewares/isClient.middleware"));

app.use("/history", require('./src/routes/history.routes'));
app.use("/lbank", require("./src/routes/lbank.routes"));
app.use("/telegram", require("./src/routes/telegram.routes"));

httpServer.listen(port, ()=>{
    console.log("server started on port ", port);
});

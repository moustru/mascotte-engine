const express = require('express');
require('./app/engine/interceptors');
const Engine = require('./app/engine');
require('dotenv').config();
const Chalk = require('chalk');

const app = express();
const PORT = process.env.PORT || 8002;
require('./config/express')(app);
require('./app/api/routes')(app);

app.get('/', (req, res) => {
    res.send('Hello, Express!')
});

app.listen(PORT, () => {
    Engine.init();
    console.log(Chalk.bgYellow(`Mascotte is running on port ${PORT}`));
})
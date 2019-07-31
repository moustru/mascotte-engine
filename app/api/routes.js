const Engine = require('../engine');

module.exports = app => {
    app.get('/info', Engine.getInfo);
}
var index = require('../routes/index');
var food = require('../routes/food');
var auth = require('../routes/auth')

module.exports = function (app){
    app.use('/',index);
    app.use('/api/auth',auth);
    app.use('/api/food', food);
}
if(process.env.NODE_ENV === 'production'){
    //automatically run on heroku
    module.exports = require('./prod');
} else {
    //return dev keys
    module.exports = require('./dev');
}
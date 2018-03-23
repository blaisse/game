const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost:/game_test');
    mongoose.connection
        .once('open', () => {done()})
        .on('error', (error) => {console.log('warning', error)});
});

beforeEach((done) => {
    const { users } = mongoose.connection.collections;
    users.drop(() => {
        console.log('users dropped');
        done();
    });
});
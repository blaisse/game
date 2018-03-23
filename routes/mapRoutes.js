const mongoose = require('mongoose');
const Map = mongoose.model('maps');

const passport = require('passport');
const passportService = require('./../services/passport');
const Authentication = require('./../controllers/auth');

const Game = require('./../game/Game');
const game = new Game();

// const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
    app.get('/api/map', requireAuth, (req, res) => {
        const user = req.user;
        Map.findOne({ name: user.map }).then((map) => {
            if(map){
                // console.log('map?', );
                res.send(game.map.mapToArray(map, map.size));
                // res.send(map.map);
            }
        });
    });
};
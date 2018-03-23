const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const keys = require('./../config/keys');
const User = mongoose.model('users');
const Map = mongoose.model('maps');
// const Map = mongoose.model('maps');
const Game = require('./../game/Game.js');
const game = new Game();
function encodeToken(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
}

exports.signup = function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) return res.status(422).send({ error: "Provide all fields" });
    
    User.findOne({ username }).then((user) => {
        if(user){
            return res.status(422).send({ error: "Email in use" });
        }
        const name = 'first';
        const u = new User({ username, password, map: name });
        //give user a place on the map here?
        const map =  Map.findOne({ name }).then((map) => {
            if(map){
                // console.log('??', map);
                const tile = game.map.changeTileToTaken(map, username);
                // console.log('map before save', map);
                // console.log('uuu3', u.tiles);
                u.tiles[tile.str] = { x: tile.x, y: tile.y, type: 'capital' };
                // console.log('uuu3', u.tiles);

                map.markModified('map');
                map.save().then((savedMap) => {
                    // console.log('saved', savedMap.map);
                });
            }
        });
        // game.map.changeTile();
        u.markModified('tiles');
        u.save().then(() => {
            res.json({ token: encodeToken(u), username: username });
        }).catch((e) => {
            res.status(422).send(e);
        });
    }).catch((e) => {
        res.send(e);
    });
}

exports.signin = function(req, res, next){
    // console.log(req.user.email);
    res.send({ token: encodeToken(req.user), username: req.user.username });
}
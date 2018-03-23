const mongoose = require('mongoose');
const passport = require('passport');
const passportService = require('./../services/passport');
const Authentication = require('./../controllers/auth');
const requireAuth = passport.authenticate('jwt', { session: false });

const Game = require('./../game/Game');
const game = new Game();

module.exports = (app) => {

    app.get('/api/getMarshals', requireAuth, (req, res) => {
        const chancery = req.user.buildings.filter((building) => {
            return building.building === 'chancery';
        });
        const maxMarshals = game.military.marshal.getMax(req.user); 
        const skills = game.military.marshal.getSkills();
        res.send({ marshals: req.user.marshals, maxMarshals, skills });
    });

    app.post('/api/hireMarshal', requireAuth, (req, res) => {
        game.military.marshal.hire(req.user, req.body.name);
        // user.queue.push
        req.user.save().then(() => {
            res.send(req.user.marshals);
        });
    });
};
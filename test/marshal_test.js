const assert = require('assert');
const mongoose = require('mongoose');
require('./../models/User');
const User = mongoose.model('users');
// const User = require('./../models/User');
const Game = require('./../game/Game');
const game = new Game();

describe('Military', () => {
    let russia; 
    let germany;
    beforeEach((done) => {
        russia = new User({ username: 'russia' });
        russia.units.push({ unit: 'peasant', amount: 3 });
        russia.units.push({ unit: 'swordsman', amount: 1 });
        germany = new User({ username: 'germany' });
        germany.units.push({ unit: 'peasant', amount: 2 });
        germany.units.push({ unit: 'swordsman', amount: 1 });
        Promise.all([russia.save(), germany.save()]).then(() => {
            done();
        });
    });

    it('should calculate xp', (done) => {
        const l = game.military.killDefendingUnits(germany.units, 'everyone');
        console.log('l?', l);
        //calculate marshals xp
        const xp = game.military.calculateXp(l);
        assert(xp === 40);
        done();
    })
});
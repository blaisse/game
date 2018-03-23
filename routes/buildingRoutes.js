const mongoose = require('mongoose');
const User = mongoose.model('users');
const passport = require('passport');
const passportService = require('./../services/passport');
const Authentication = require('./../controllers/auth');

const units = require('./../game/units');
const tech = require('./../game/technologies');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {

    app.post('/api/newreport', requireAuth, (req, res) => {
        req.user.newReport = false;
        req.user.save().then(() => {
            res.send(req.user.newReport);
        });
    });

    app.get('/api/newreport', requireAuth, (req, res) => {
        res.send(req.user.newReport);
    });

    app.post('/api/unreadreport', requireAuth, (req, res) => {
        console.log('user', req.body);
        const index = req.user.reports.findIndex(x => x.id == req.body.id);
        // console.log('i', index);
        // console.log(req.user.reports[0]);
        req.user.reports[index].read = true;
        // console.log(req.user.reports[0]);
        req.user.markModified('reports');
        req.user.save().then(() => {
            res.send(req.user.reports);
        });
    });
    app.get('/api/buildings/:kind', requireAuth, (req, res) => {
        // console.log('kind:', req.params.kind);
        res.send(req.user.getBuildings(req.params.kind));
    });
    app.get('/api/queueBuildings', requireAuth, (req, res) => {
        res.send(req.user.queueBuildings);
    });

    app.get('/api/reports', requireAuth, (req, res) => {
        res.send(req.user.reports);
    });

    app.get('/api/hireable', requireAuth, (req, res) => {
        // console.log('units:', units);
        let hireable = {};
        req.user.hireable.forEach((unit) => {
            hireable[unit] = units[unit];
        });
        // console.log('hh', hireable);
        res.send(hireable);
    });
    app.get('/api/notresearched', requireAuth, (req, res) => {
        //get only those that cannot be researched and have not been researched
        // let newObj = {};
        // let newObj = Object.assign({}, tech);
        let newObj = {};
        const clonedTech = JSON.parse(JSON.stringify(tech));
        // let obj = Object.create(tech);
        // console.log('first trech', tech['iron swords']);
        // let obj = tech;
        Object.keys(tech).forEach((item) => {
            const queueArray = req.user.queue.filter((re) => {
                return re.item === item;
            });
            if(queueArray.length > 0){
                newObj[item] = clonedTech[item];
                newObj[item]["queue"] = true;
                newObj[item]["completed"] = queueArray[0].completed;
            }
        });
        Object.keys(tech).forEach((item) => {
            const researchableArray = req.user.researchable.filter((re) => {
                return re === item;
            });
            if(researchableArray.length > 0){
                // console.log('WHY???', item);
                // newObj[item] = obj[item];
                newObj[item] = clonedTech[item];
                // newObj[item] = Object.create(newObj, tech);
                // Object.assign(newObj, tech);
                // newObj[item]["researchable"];
                newObj[item]["researchable"] = true;

                //IT REFERENCES TO WHATS ON THE RIGHT
                // console.log('TECH ITEM LOOK HERE', tech[item]);
                // console.log('--------',);
            }
        });
        
        Object.keys(tech).forEach((item) => {
            //Unavailable research
            const researchArray = req.user.research.filter((re) => {
                return re === item;
            });
            const researchableArray = req.user.researchable.filter((re) => {
                return re === item;
            });
            const queueArray = req.user.queue.filter((re) => {
                return re.item === item;
            });
            if(researchArray.length === 0 && researchableArray.length === 0 && queueArray.length === 0){
                
                newObj[item] = clonedTech[item];
                // console.log('wrd is this', newObj[item].researchable);
                // obj[item].research = true;
            }
        });
        // console.log('---', tech['iron swords'], '---');
        Object.keys(tech).forEach((item) => {
            const researchArray = req.user.research.filter((re) => {
                return re === item;
            });
            if(researchArray.length > 0){
                newObj[item] = clonedTech[item];
                newObj[item].research = true;
                // obj[item].research = true;
            }
        });
        // console.log('we', newObj);
        // Object.keys(obj). ;
        // console.log('send hrlp', req.user.username);
        // console.log('new obj', newObj);
        // console.log('pls fix yourself', newObj);
        res.send(newObj);
    });
    app.get('/api/notresearched2', (req, res) => {
        const obj = tech;
        Object.keys(tech).forEach(() => {

        });
    });
    app.get('/api/researchable', requireAuth, (req, res) => {
        res.send(req.user.researchable);
    });
    app.get('/api/research', requireAuth, (req, res) => {
        res.send(req.user.research);
    });

    app.get('/api/resources', requireAuth, (req,  res) => {
        res.send(req.user.resources);
    });

    app.get('/api/income', requireAuth, (req, res) => {
        res.send(req.user.income);
    });

    app.get('/api/units', requireAuth, (req, res) => {
        res.send(req.user.units);
    });
};
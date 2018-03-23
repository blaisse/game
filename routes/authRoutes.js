const mongoose = require('mongoose');
const passport = require('passport');
const passportService = require('./../services/passport');
const Authentication = require('./../controllers/auth');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

const User = mongoose.model('users');

//requireAuth -> req.user stores entire user object

module.exports = (app) => {

    app.post('/api/signin', requireSignin, Authentication.signin);
    app.post('/api/signup', Authentication.signup);

    app.get('/api/heil', requireAuth, (req, res) => {
        res.send('wtf?');
    });

    app.post('/api/signup2', async (req, res) => {
        console.log(req.body);
        const user = await User.findOne({username: req.body.username});
        console.log('q', user);
        if(!user){
            const savedUser = await new User({ username: req.body.username }).save();
            // console.log('saved', savedUser);
        } else {
            console.log('gtfo');
        }
    });
};
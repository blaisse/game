const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const keys = require('./../config/keys');
const User = mongoose.model('users');

const localOptions = { usernameField: 'username' };

const localLogin = new LocalStrategy(localOptions, async function(username, password, done){
    const user = await User.findOne({ username });
    user.comparePasswords(password, function(err, isMatch){
        if(err){
            return done(err);
        }
        if(!isMatch){
            return done(null, false);
        }
        return done(null, user);
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('auth'),
    secretOrKey: keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, async function(payload, done){
    const user = await User.findById(payload.sub);
    if(user){
        done(null, user);
    } else {
        done(null, false);
    } 
});

passport.use(localLogin);
passport.use(jwtLogin);


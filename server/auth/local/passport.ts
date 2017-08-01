import * as passport from 'passport';

const LocalStrategy = require('passport-local').Strategy;

export default function fnSetupLocalPassport(Users) {
    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            Users.findOne({
                email: email.toLowerCase()
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'This email is not registered.'});
                }
                if (!user.fnAuthenticate(password)) {
                    return done(null, false, {message: 'This password is not correct.'});
                }
                return done(null, user);
            });
        }
    ));
}

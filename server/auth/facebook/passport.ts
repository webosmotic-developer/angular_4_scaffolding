import * as passport from 'passport';

const FacebookStrategy = require('passport-facebook').Strategy;

export default function fnSetupFacebookPassport(Users) {
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_ID || 'id',
            clientSecret: process.env.FACEBOOK_SECRET || 'secret',
            callbackURL: '/auth/facebook/callback',
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
        },
        function (accessToken, refreshToken, profile, done) {
            Users.findOne({
                    'facebook.id': profile.id
                },
                function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        user = new Users({
                            name: profile._json.first_name + ' ' + profile._json.last_name,
                            email: profile._json.email,
                            role: 'user',
                            username: profile.username,
                            provider: 'facebook',
                            facebook: profile._json
                        });
                        user.save(function (err) {
                            if (err) return done(err);
                            done(err, user);
                        });
                    } else {
                        return done(err, user);
                    }
                });
        }
    ));
}

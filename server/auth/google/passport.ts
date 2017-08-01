import * as passport from 'passport';

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

export default function fnSetupGooglePassport(Users) {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_ID || 'id',
            clientSecret: process.env.GOOGLE_SECRET || 'secret',
            callbackURL: '/auth/google/callback',
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
        }, (accessToken, refreshToken, profile, done) => {
            Users.findOne({
                'google.id': profile.id
            }, function (err, user) {
                if (!user) {
                    user = new Users({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        username: profile.username,
                        provider: 'google',
                        google: profile._json
                    });
                    user.save(function (_err) {
                        if (_err) {
                            return done(_err);
                        }
                        done(_err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));
}

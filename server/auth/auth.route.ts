import * as passport from 'passport';
import fnSetupLocalPassport from './local/passport';
import fnSetupFacebookPassport from './facebook/passport';
import fnSetupGooglePassport from './google/passport';
import fnLocal from './local/local';
import Users from '../api/users/users.model';
import Auth from './auth';

export default function fnAuthRoutes(router) {

    const auth = new Auth();

    /**
     *  Passport Configuration
     */
    fnSetupLocalPassport(Users);
    fnSetupFacebookPassport(Users);
    fnSetupGooglePassport(Users);

    router.route('/auth/login').post(fnLocal);
    router.route('/auth/logout')
        .get((req, res) => {
            // here is our security check
            // this destroys the current session (not really necessary because you get a new one
            req.session.destroy(function () {
                // if you don't want destroy the whole session, because you anyway get a new one you also could just change
                // the flags and remove the private information
                req.session = null; // set flag
                res.clearCookie('connect.sid', {path: '/'}); // see comments above
                res.status(200).send('ok'); // tell the client everything went well
            });
        });

    router.route('/auth/facebook')
        .get(passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/',
            session: false
        }));

    router.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook', {
            failureRedirect: '/',
            session: false
        }), auth.fnSetTokenCookie);

    router.route('/auth/google')
        .get(passport.authenticate('google', {
            failureRedirect: '/',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            session: false
        }));

    router.route('/auth/google/callback')
        .get(passport.authenticate('google', {
            failureRedirect: '/',
            session: false
        }), auth.fnSetTokenCookie);
}

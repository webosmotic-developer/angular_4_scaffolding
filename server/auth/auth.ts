import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as compose from 'composable-middleware';
import * as expressJwt from 'express-jwt';
import Users from '../api/users/users.model';

dotenv.load({path: '.env'});
const SECRET_SESSION = process.env.SECRET_SESSION;
const validateJwt = expressJwt({secret: SECRET_SESSION});
const roles = ['USER', 'ADMIN'];

export default class Auth {

    /**
     * Attaches the user object to the request if authenticated
     * Otherwise returns 401
     */
    fnIsAuthenticated = () => {
        return compose()
        // Validate jwt
            .use((req, res, next) => {
                // allow access_token to be passed through query parameter as well
                if (req.query && req.query.hasOwnProperty('access_token')) {
                    req.headers.authorization = 'Bearer:' + req.query.access_token;
                }
                validateJwt(req, res, next);
            })
            // Attach user to request
            .use((req, res, next) => {
                Users.findById(req.user._id, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return res.status(401).send('Unauthorized');
                    }
                    req.user = user;
                    next();
                });
            });
    };

    /**
     * Checks if the user role meets the minimum requirements of the route
     */
    fnHasRole = (roleRequired) => {
        if (!roleRequired) {
            throw new Error('Required role needs to be set');
        }

        return compose()
            .use(this.fnIsAuthenticated())
            .use(function meetsRequirements(req, res, next) {
                if (roles.indexOf(req.user.role) >= roles.indexOf(roleRequired)) {
                    next();
                } else {
                    res.status(403).send('Forbidden');
                }
            });
    };

    /**
     * Returns a jwt token signed by the app secret
     */
    fnSignToken = (id) => {
        return jwt.sign({_id: id}, SECRET_SESSION, {expiresIn: 60 * 5});
    };

    /**
     * Set token cookie directly for oAuth strategies
     */
    fnSetTokenCookie = (req, res) => {
        if (!req.user) {
            return res.status(404).json({message: 'Something went wrong, please try again.'});
        }
        const token = this.fnSignToken(req.user._id);
        res.cookie('token', JSON.stringify(token));
        res.redirect('/');
    };
}

import * as _ from 'lodash';
import * as passport from 'passport';
import Auth from '../auth';

export default function fnLocal(req, res, next) {
    const auth = new Auth();
    passport.authenticate('local', function (err, user, info) {
        const error = err || info;
        if (error) {
            return res.status(401).json(error);
        }
        if (!user) {
            return res.status(404).json({message: 'Something went wrong, please try again.'});
        }
        const token = auth.fnSignToken(user._id);
        const filterUser = _.pick(user, _.keys({
            _id: null,
            provider: null,
            name: null,
            email: null,
            role: null
        }));
        res.json({token: token, user: filterUser});
    })(req, res, next);
}

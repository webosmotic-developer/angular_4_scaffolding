import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import Users from './users.model';
import DAO from '../../services/dao';

dotenv.load({path: '.env'});

export default class UsersDAO extends DAO {
    model = Users;

    fnGetUsers = (req) => {
        const fields = '-salt -hashedPassword';
        const query = req.query.search ? {name: new RegExp(req.query.search, 'i')} : {};
        return new Promise((resolve, reject) => {
            this.fnGetAll(query, fields)
                .then(users => {
                    resolve(users);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    fnGetUser = (req) => {
        const fields = '-salt -hashedPassword';
        return new Promise((resolve, reject) => {
            this.fnGet(req.params.id, fields)
                .then(user => {
                    resolve(user);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    /**
     * Create a new user.
     * @param {object} req - request object.
     */
    fnCreateUser = (req) => {
        const _user = new Users(req.body);
        _user.provider = 'local';
        return new Promise((resolve, reject) => {
            this.fnInsert(_user)
                .then(obj => {
                    const token = jwt.sign({_id: obj['_id']}, process.env.SECRET_SESSION, {expiresIn: 60 * 5});
                    resolve({token: token});
                })
                .catch(err => {
                    reject(err);
                });
        });
    };
}

import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
const authTypes = ['facebook', 'google'];

const usersSchema = new mongoose.Schema({
    name: String,
    email: {type: String, lowercase: true},
    role: {type: String, default: 'USER'},
    createdAt: {type: Date, default: Date.now},
    hashedPassword: String,
    provider: String,
    salt: String,
    facebook: {},
    google: {}
});

/**
 * Virtuals
 */
usersSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.fnMakeSalt();
        this.hashedPassword = this.fnEncryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Public profile information
 */
usersSchema
    .virtual('profile')
    .get(function () {
        return {
            'name': this.name,
            'role': this.role
        };
    });

/**
 * Non-sensitive info we'll be putting in the token
 */
usersSchema
    .virtual('token')
    .get(function () {
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/**
 * Validations empty email
 */
usersSchema
    .path('email')
    .validate(function (email) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return email.length;
    }, 'Email cannot be blank');

/**
 * Validations empty password
 */
usersSchema
    .path('hashedPassword')
    .validate(function (hashedPassword) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return hashedPassword.length;
    }, 'Password cannot be blank');

/**
 * Validate email is not taken
 */
usersSchema
    .path('email')
    .validate(function (value, respond) {
        const self = this;
        this.constructor.findOne({email: value}, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                if (self.id === user.id) {
                    return respond(true);
                }
                if (self.provider !== user.provider) {
                    return respond(true);
                }
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified email address is already in use.');

const fnValidatePresenceOf = function (value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
usersSchema
    .pre('save', function (next) {
        if (!this.isNew) {
            return next();
        }

        if (!fnValidatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });

/**
 * Methods
 */
usersSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    fnAuthenticate: function (plainText) {
        return this.fnEncryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    fnMakeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    fnEncryptPassword: function (password) {
        if (!password || !this.salt) {
            return '';
        }
        const salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    }
};

const Users = mongoose.model('Users', usersSchema);
export default Users;

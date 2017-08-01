import UsersDAO from './users.dao';
const usersDAO = new UsersDAO();

export default class UsersController {

    /**
     * Get list of users.
     * @param {object} req - request object.
     * @param {object} res - response object.
     */
    fnGetUsers = (req, res) => {
        usersDAO
            .fnGetUsers(req)
            .then(user => res.status(200).json(user))
            .catch(error => res.status(400).json(error));
    };

    /**
     * Get a user.
     * @param {object} req - request object.
     * @param {object} res - response object.
     */
    fnGetUser = (req, res) => {
        usersDAO
            .fnGetUser(req)
            .then(user => res.status(200).json(user))
            .catch(error => res.status(400).json(error));
    };

    /**
     * Create a new user.
     * @param {object} req - request object.
     * @param {object} res - response object.
     */
    fnCreateUser = (req, res) => {
        usersDAO
            .fnCreateUser(req)
            .then(user => res.status(201).json(user))
            .catch(error => res.status(422).json(error));
    };

    /**
     * Update existing user.
     * @param {object} req - request object.
     * @param {object} res - response object.
     */
    fnUpdateUser = (req, res) => {
        usersDAO
            .fnUpdate(req.params.id, req.body)
            .then(user => res.status(200).json(user))
            .catch(error => res.status(400).json(error));
    };

    /**
     * Remove user.
     * @param {object} req - request object.
     * @param {object} res - response object.
     */
    fnDeleteUser = (req, res) => {
        usersDAO
            .fnDelete(req.params.id)
            .then(user => res.status(200).json(user))
            .catch(error => res.status(400).json(error));
    };

    /**
     * Total users.
     * @param {object} req - request object.
     * @param {object} res - response object.
     */
    fnCountUser = (req, res) => {
        usersDAO
            .fnCount()
            .then(count => res.status(200).json(count))
            .catch(error => res.status(400).json(error));
    };
}

import UsersController from './users.controller';
import Auth from '../../auth/auth';

export default function fnUsersRoutes(router) {

    const usersCtrl = new UsersController();
    const auth = new Auth();

    router.route('/users').get(auth.fnHasRole('ADMIN'), usersCtrl.fnGetUsers);
    router.route('/users').post(usersCtrl.fnCreateUser);
    router.route('/users/count').get(auth.fnIsAuthenticated(), usersCtrl.fnCountUser);
    router.route('/users/:id').get(auth.fnIsAuthenticated(), usersCtrl.fnGetUser);
    router.route('/users/:id').put(auth.fnIsAuthenticated(), usersCtrl.fnUpdateUser);
    router.route('/users/:id').delete(auth.fnHasRole('ADMIN'), usersCtrl.fnDeleteUser);

}

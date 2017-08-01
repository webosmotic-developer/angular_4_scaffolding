import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as passport from 'passport';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

import fnSetRoutes from './routes';

const mongoStore = require('connect-mongo')(session);
const app = express();

dotenv.load({path: '.env'});
app.set('port', (process.env.PORT || 3000));
app.set('views', path.join(__dirname, '../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');

    // Persist sessions with mongoStore
    // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
    app.use(session({
        secret: process.env.SECRET_SESSION,
        resave: false,
        unset: 'destroy',
        saveUninitialized: true,
        store: new mongoStore({
            mongooseConnection: db,
            db: 'ParcelPort'
        })
    }));

    fnSetRoutes(app);

    app.listen(app.get('port'), () => {
        console.log('Angular Full Stack listening on port ' + app.get('port'));
    });
});

export {app};

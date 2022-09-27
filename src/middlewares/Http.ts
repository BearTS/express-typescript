import { Application } from 'express';
// import session from 'express-session';
import compression from 'compression';
import helmet from "helmet";
import hpp from 'hpp';
// import MongoStore from "connect-mongo";
import Log from './Log';
// import passport from 'passport';
import expressValidator from "express-validator";

class Http {
    public static init(_app: Application): Application {
        Log.info('Initializing HTTP middleware');
        _app.use(expressValidator());


        _app.use(hpp());
        _app.use(helmet());
        _app.use(compression());

        // const sessionOptions = {
		// 	resave: true,
		// 	saveUninitialized: true,
		// 	secret: process.env.SESSION_SECRET,
		// 	cookie: {
		// 		maxAge: 1209600000 // two weeks (in ms)
		// 	},
        //     store: MongoStore.create({
        //         mongoUrl: process.env.MONGO_URI
        //     })
		// };
        // _app.use(session(sessionOptions));
 
        // _app.use(passport.initialize());
        // _app.use(passport.session());
        
        return _app;
    }
}

export default Http;
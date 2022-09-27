import { Application } from "express";
import Log from "../middlewares/Log";
import AuthRoute from "../routes/auth";


class Routes {
    public mount(_app: Application): Application {
        Log.info('Initializing routes');
        _app.get('/', (req, res) => {
            res.send('Working!');
        });
        _app.use('/api', AuthRoute);
        return _app;
    }
}

export default new Routes;
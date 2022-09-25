import { Application } from "express";
import Log from "../middlewares/Log";

class Routes {
    public mount(_app: Application): Application {
        Log.info('Initializing routes');
        _app.get('/', (req, res) => {
            res.send('Hello World!');
        });
        return _app;
    }
}

export default new Routes;
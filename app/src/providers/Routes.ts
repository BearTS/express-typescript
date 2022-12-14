import { Application } from "express";
import Log from "../middlewares/Log";
import AuthRoute from "../routes/auth";
import os from "os";

class Routes {
  public mount(_app: Application): Application {
    Log.info('Initializing routes');
    _app.get('/', (req, res) => {
      res.send(`<h3>It's ${os.hostname()}</h3>`);
    });
    _app.use('/api', AuthRoute);
    return _app;
  }
}

export default new Routes;
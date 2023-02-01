import os from "os";
import { Application } from "express";
import AuthRoute from "../routes/auth";
import Log from "../middlewares/Log";

/**
 * @class Routes
 * @description This class is used to initialize the routes
 */
class Routes {
  
  /**
   * @method mount
   * @description This function is used to initialize the routes
   * @param {Application} app - Express application
   * @returns Application of type express
   */
  public mount(_app: Application): Application {
    Log.info('Initializing routes');
    
    // This is a sample route
    _app.get('/', (req, res) => {
      res.send(`<h3>It's ${os.hostname()}</h3>`);
    });

    _app.use('/api', AuthRoute);
    return _app;
  }
}

export default new Routes;
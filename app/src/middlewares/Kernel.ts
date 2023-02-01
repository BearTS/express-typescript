import type { Application } from "express";
import CORS from "./Cors";
import Http from "./Http";
import morgan, { StreamOptions } from "morgan";
import Log from "./Log";

/**
 * @class Kernel
 * @description This class is used to initialize the essential middlewares
 * @returns Application of type express
 */
class Kernel {

  /**
   * @method init
   * @description This function is used to initialize the essential middlewares
   * @param {Application} app - Express application
   * @returns {Application} - Express application
   */
  public static init(_app: Application): Application {
    
    // Initialize the essential middlewares
    _app = CORS.init(_app);
    _app = Http.init(_app);

    // Initialize the morgan middleware to log HTTP requests
    const StreamOptions: StreamOptions = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      write: (message: any) => { 
        Log.info(`HTTP: ${message}`);
      },
    };
    _app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: StreamOptions }));
    return _app;
  }
}
export default Kernel;

import Express from "./Express";
import { Database } from "./Database";
import Log from "../middlewares/Log";
import dotenv from "dotenv";


dotenv.config();

/**
 * @class App
 * @description This class is used to initialize the application
 */
class App {

  /**
   * @method loadServer
   * @description This function is used to load the server
   * @returns void
   */
  public loadServer(): void {
    Log.info('Server :: Loading...');
    Express.init();
  }

  /**
   * @method loadDatabase
   * @description This function is used to load the database
   * @returns void
   */
  public loadDatabase(): void {

    Log.info('Database :: Loading...');

    Database.init();
  }
}

export default new App;
import dotenv from "dotenv";
import express from "express";
import http from "http";
import Kernel from "../middlewares/Kernel";
import Routes from "./Routes";
import SocketIOService from "./Sockets";
import Log from "../middlewares/Log";

dotenv.config();

/**
 * @class Express
 * @description This class is used to initialize the express server
 */
class Express {
  public express: express.Application;
  private server: http.Server;

  /**
   * @constructor
   * @description This function is used to initialize the express server
   * @returns void
   */
  constructor() {
    this.express = express();
    this.createServer();
    this.mountMiddlewares();
    this.mountRoutes();
  }

  /**
   * @method init
   * @description This function is used to initialize the express server
   * @returns void
   */
  public init(): void {
    const port = process.env.PORT || 3000;
    SocketIOService.init(this.server);
    
    // for 404 handler  
    this.express.use((req, res) => {
      res.status(404).json({
        status: 404,
        message: "Not Found",
      });
    });
    this.server.listen(port, () => {
      Log.info(`Server :: Running on port ${port}`);
    });  
  }

  private mountRoutes(): void {
    this.express = Routes.mount(this.express);
  }

  private mountMiddlewares(): void {
    this.express = Kernel.init(this.express);
  }

  private createServer(): void {
    this.server = http.createServer(this.express);
  }

}

export default new Express();

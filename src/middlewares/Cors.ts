import cors from "cors";
import { Application } from "express";
import Log from "./Log";

class Cors {
  public static init(_app: Application): Application {
    Log.info("Initializing CORS middleware");

    const corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200
    };
    _app.use(cors(corsOptions));

    return _app;
  }
}

export default Cors;

import mongoose from "mongoose";
import Log from "../middlewares/Log";

/**
 * @class Database
 * @description This class is used to initialize the database
 */
export class Database {

  /**
   * @method init
   * @description This function is used to initialize the database
   * @returns void
   */
  public static init(): void {
    Log.info(process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI);
        
    mongoose.connection.on("error", (err) => {
      Log.error('MongoDB connection error: ' + err);
      process.exit();
    });
    mongoose.connection.on("connected", () => {
      Log.info("Connected to MongoDB");
    });
    mongoose.connection.on("disconnected", () => {
      Log.info("Disconnected from MongoDB");
    });

  }
}

export default mongoose;
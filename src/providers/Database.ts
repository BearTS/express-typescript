import mongoose from "mongoose";
import Log from "../middlewares/Log";

export class Database  {
    public static init(): any {
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
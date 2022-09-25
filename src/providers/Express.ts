import express from "express";
import Kernel from "../middlewares/Kernel";
import Log from "../middlewares/Log";
import Routes from "./Routes";
import dotenv from "dotenv";

dotenv.config();
class Express{
    public express: express.Application;

    constructor(){
        this.express = express();
        this.mountMiddlewares();
        this.mountRoutes();
    }
    private mountRoutes(): void{
        this.express = Routes.mount(this.express);
    }
    private mountMiddlewares(): void{
        this.express = Kernel.init(this.express);
    }

    public init(): any{
        const port = process.env.PORT || 3000;
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    
        this.express.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
        }).on("error", (_error) => {
            return Log.error('Error: ' + _error.message);
        })
    }
}

export default new Express;

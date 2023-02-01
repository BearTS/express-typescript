import { createLogger, format, transports } from "winston";
import type { Logger } from "winston";

/**
 * @class Log
 * @description This class is used to initialize the logger
 * @returns Logger of type winston
 */
class Log {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.json(),
        format.prettyPrint(),
        format.colorize()
      ),
      transports: [
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new transports.Console({
          format: format.simple(),
        })
      );
    }
  }

  /**
   * @method info
   * @description This method is used to log info messages
   * @param {string} message
   * @returns void
   */
  public info(message: string) {
    this.logger.info(message);
  }

  /**
   * @method error
   * @description This method is used to log error messages
   * @param {string} message
   * @returns void
   */
  public error(message: string) {
    this.logger.error(message);
  }
}

export default new Log();

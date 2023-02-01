import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

/**
 * @class Validate
 * @type {Middleware}
 * @description This class is used to validate the request body and params
 */
class Validate {

  /**
    * @method body
    * @description This function is used to validate the request body
    * @param {Schema} schema - Joi schema
    * @param {string} errors - Error to be returned
    * @returns void
   */
  public static body = (schema: Schema, errors?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      const valid = error == null;
      if (valid) {
        next();
      } else {
        const { details } = error;
        let message = details.map((i) => i.message).join(",");
        if (errors) {
          message = errors;
        }
        res.status(422).json({ success: false, error: message });
      }
    };
  };

  /**
   * @method params
   * @description This function is used to validate the request params
   * @param {Schema} schema - Joi schema
   * @param {any} errors - Errors to be returned
   * @returns void
   */
  public static params = (schema: Schema, errors?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.params);
      const valid = error == null;
      if (valid) {
        next();
      } else {
        const { details } = error;
        let message = details.map((i) => i.message).join(",");
        if (errors) {
          message = errors;
        }
        res.status(422).json({ success: false, error: message });
      }
    };
  };

  /**
   * @method query
   * @description This function is used to validate the request query
   * @param {Schema} schema - Joi schema
   * @param {any} errors - Errors to be returned
   * @returns void
   */
  public static query = (schema: Schema, errors?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.query);
      const valid = error == null;
      if (valid) {
        next();
      } else {
        const { details } = error;
        let message = details.map((i) => i.message).join(",");
        if (errors) {
          message = errors;
        }
        res.status(422).json({ success: false, error: message });
      }
    };
  };
}

export default Validate;

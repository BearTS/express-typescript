import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import IToken from "../interfaces/token";

/**
 * @function authorise
 * @type {Middleware}
 * @description This middleware is used to authorise the user
 * @returns Response of type express
 */
export const authorise = async (req: Request, res: Response, next: NextFunction) => {
  const jwtsecret = process.env.JWT_SECRET;
  let token: string = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided.'
    });
  }
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, jwtsecret, (err: Error, decoded: IToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Token'
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token'
    });
  }
};
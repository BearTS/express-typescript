import { Request, Response } from "express";
import { v4 } from "uuid";
import User, { IUserModel } from "../../models/user.model";
import { sendEmail } from "../../services/sendEmail";
import Log from "../../middlewares/Log";

/**
 * @class Login
 * @description This class is used to login a user
 * @exports Login
 */
class Login {

  /**
   * @method login
   * @description This method is used to login a user
   * @param {Request} req: Request of type express
   * @param {Response} res: Response of type express
   * @returns Response of type express
   */
  public static async login(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const user: IUserModel = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (!user.isVerified){
        return res.status(400).send("User not verified");
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).send("Invalid credentials");
      }
      const token = await user.createToken();
      return res.status(200).json({
        message: "Logged in",
        token
      });
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
  public static async sendForgotPassword(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email } = req.body;
      const user: IUserModel = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (!user.isVerified){
        return res.status(400).send("User not verified");
      }
      const token = v4();
      user.passwordResetToken = token;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
      const subject = "Reset Password";
      const text = `Click me to reset your password`;
      await sendEmail(user.email, subject, text);
      return res.status(200).json({
        message: "Email sent"
      });
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
  public static async resetPassword(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { id, hash, password } = req.body;
      const user: IUserModel = await User.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (user.passwordResetToken !== hash) {
        return res.status(401).send("Invalid token");
      }
      if (user.passwordResetExpires < new Date()) {
        return res.status(401).send("Token expired");
      }
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(200).json({
        message: "Password reseted"
      });
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  public static async renewToken(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      const user: IUserModel = await User.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      const token = await user.createToken();
      return res.status(200).json({
        message: "Token renewed",
        token
      });
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
        
}

export default Login;
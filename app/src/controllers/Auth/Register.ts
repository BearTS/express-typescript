import Log from "../../middlewares/Log";
import { Request, Response } from "express";
import { v4 } from "uuid";
import User, { IUserModel } from "../../models/user.model";
import { sendEmail } from "../../services/sendEmail";
class Register {
  public static async signup(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const user: IUserModel = await User.findOne({ email });
      if (user) {
        return res.status(400).send("User already exists");
      }
      const hash = v4();
      const newUser = new User({
        email,
        password,
        verifyHash: hash
      });
      await newUser.save();
      const subject = "Verify your email";
      const html = `<a href="http://${req.get('host')}/verify/${newUser._id}/${hash}">Verify your email</a>`;
      await sendEmail(user.email, subject, html);
      return res.status(201).json({
        message: "User created. Check your email to verify your account"
      });
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  public static async verify(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { id, hash } = req.params;
      const user: IUserModel = await User.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (user.isVerified){
        return res.status(400).send("User already verified");
      }
      if (user.verifyHash !== hash) {
        return res.status(400).send("Invalid hash");
      }
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        message: "User verified"
      });
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
  public static async resend(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { email } = req.body;
      const user: IUserModel = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (user.isVerified){
        return res.status(400).send("User already verified");
      }
      const hash = v4();
      user.verifyHash = hash;
      await user.save();
      const subject = "Verify your email";
      const html = `<a href="http://${req.get('host')}/verify/${user._id}/${hash}">Verify your email</a>`;
      await sendEmail(user.email, subject, html);
      return res.status(200).json({
        message: "Email sent"
      });
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
}

export default Register;
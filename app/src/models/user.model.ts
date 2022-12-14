import IUser from "../interfaces/user";
import mongoose from "../providers/Database";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import Token from "./token.model";

export interface IUserModel extends Omit<IUser, '_id'>, mongoose.Document {
    passwordResetToken: string;
    passwordResetExpires: Date;
    isVerified: boolean;
    verifyHash: string;
    comparePassword: (password: string) => Promise<boolean>;
    createToken: () => object;
    renewToken: (refreshToken: string) => object;

}

export const UserSchema = new mongoose.Schema<IUserModel>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  verifyHash: { type: String }
}, {
  timestamps: true
});

UserSchema.pre<IUserModel>("save", async function (next) {
  const user = this as IUserModel;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});
  
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as IUserModel;
  const isMatch = await bcryptjs.compare(candidatePassword, user.password);
  return isMatch;
};

UserSchema.methods.createToken = function () {
  const user = this as IUserModel;
  const token = jwt.sign({ 
    id: user._id 
  }, process.env.JWT_SECRET, {
    expiresIn: 86400, // 1 day
  });
    
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() + 1);
    
  const _refreshToken = v4();
  const refreshToken = new Token({
    token: _refreshToken,
    user: user._id,
    expiryDate: expiredDate
  });
  return { accessToken: token, refreshToken: refreshToken };
};

UserSchema.methods.renewToken = async function (refreshToken: string) {
  const user = this as IUserModel;
  const token = await Token.findOne({ token: refreshToken });
  if (!token) {
    throw new Error("Invalid refresh token");
  }
  if (token.user.toString() !== user._id.toString()) {
    throw new Error("Invalid refresh token");
  }
  if (token.expiryDate < new Date()) {
    throw new Error("Refresh token expired");
  }
  const newToken = jwt.sign({ 
    id: user._id 
  }, process.env.JWT_SECRET, {
    expiresIn: 86400, // 1 day
  });
  return { accessToken: newToken, refreshToken: token };
};


const User = mongoose.model<IUserModel>("User", UserSchema);

export default User;
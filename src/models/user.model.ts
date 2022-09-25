import IUser from "../interfaces/user";
import mongoose from "../providers/Database";
import bcrypt from "bcryptjs";
export interface IUserModel extends Omit<IUser, '_id'>, mongoose.Document {
    comparePassword(password: string, cb: any): string;
}

export const UserSchema = new mongoose.Schema<IUserModel>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
})

UserSchema.pre<IUserModel>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (err) {
        next(err);
    }
})

UserSchema.methods.comparePassword = async function (candidatePassword: string, cb: any) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        cb(null, isMatch);
    } catch (err) {
        cb(err);
    }
}


const User = mongoose.model<IUserModel>("User", UserSchema);

export default User;
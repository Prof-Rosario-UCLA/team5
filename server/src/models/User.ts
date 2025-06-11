import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface UserDoc extends Document {
  email: string;
  passwordHash: string;
  verified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  verifyPassword(pw: string): Promise<boolean>;
}

const userSchema = new Schema<UserDoc>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date
});

userSchema.methods.verifyPassword = function (pw: string) {
  return bcrypt.compare(pw, this.passwordHash);
};
export const User: Model<UserDoc> = model<UserDoc>("User", userSchema);
export default User;

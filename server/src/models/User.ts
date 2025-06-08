import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  passwordHash: String,
  verified: { type: Boolean, default: false }
});
userSchema.methods.verifyPassword = function (pw: string) {
  return bcrypt.compare(pw, this.passwordHash);
};
export default model("User", userSchema);

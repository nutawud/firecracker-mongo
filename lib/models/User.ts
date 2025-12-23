import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    fname: String,
    lname: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);

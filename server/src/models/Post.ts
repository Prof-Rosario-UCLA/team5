import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    markdown: String,
    html: String,
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);
export default model("Post", postSchema);

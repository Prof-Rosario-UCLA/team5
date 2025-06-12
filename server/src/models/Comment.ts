import { Schema, model, Document, Types } from "mongoose";

export interface CommentDoc extends Document {
  postId: Types.ObjectId;
  author: Types.ObjectId;
  body: string;
  createdAt: Date;
}

const commentSchema = new Schema<CommentDoc>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body:   { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<CommentDoc>("Comment", commentSchema);

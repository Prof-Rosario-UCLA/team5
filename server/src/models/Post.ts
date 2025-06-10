import { Schema, model, Document, Types } from "mongoose";

export interface PostDoc extends Document {
  author: Types.ObjectId;
  title: string;
  markdown: string;
  html: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDoc>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true as const
    },
    title: { type: String, required: true },
    markdown: { type: String, required: true },
    html: { type: String, required: true },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default model<PostDoc>("Post", postSchema);


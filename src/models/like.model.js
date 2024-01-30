import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    likeBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet"
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },

  },
  {
    timestamps: true
  }
)

export const Like = model("Like", likeSchema)
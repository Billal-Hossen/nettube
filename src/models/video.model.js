import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const videoSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "title is required"]
    },
    description: {
      type: String,
      require: [true, "description is required"]
    },
    videoFile: {
      type: String,
      require: [true, "videoFile is required"]
    },
    thumbnail: {
      type: String,
      require: [true, "thumbnail is required"]
    },
    duration: {
      type: Number,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }

  },
  {
    timestamps: true
  }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = model("Video", videoSchema)
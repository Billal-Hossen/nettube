import { Schema, model } from "mongoose";

const playlistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videos: [
    {
      type: String,
      required: true
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},
  {
    timestamps: true
  }
)

export const PlayList = model("Playlist", playlistSchema)
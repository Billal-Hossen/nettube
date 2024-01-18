import { Schema, model } from "mongoose"

const subcriptionSchema = new Schema({
  subcriber: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true })

const Subcription = model("Subcription", subcriptionSchema)
export { Subcription }
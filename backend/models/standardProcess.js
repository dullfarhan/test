import mongoose from "mongoose";
const Schema = mongoose.Schema;

const standardProcessSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: Object,
    require: true,
  },
  // releasedVersion: {
  //   type: String,
  //   default: '1.0.0',
  //   require: true,
  // },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

export default mongoose.model("standard_process", standardProcessSchema);

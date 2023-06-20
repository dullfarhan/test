import mongoose from "mongoose";
const Schema = mongoose.Schema;

const standardProcessRelease = Schema({
  releasedVersion: {
    type: String,
    required: true,
  },
  releaseComment: {
    type: String,
    required: true,
  },
  releaseStatus: {
    type: String,
    required: true,
  },
  releasedBy: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  standardProcess: {
    type: mongoose.Schema.ObjectId,
    ref: "standard_process",
    required: true
  },
  processPage: {
    type: Array,
    required: true,
  }, 
});

export default mongoose.model("standard_process_release", standardProcessRelease);

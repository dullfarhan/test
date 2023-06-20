import mongoose from "mongoose";
const Schema = mongoose.Schema;

const processPageReleaseSchema = Schema({
  reviewProcess: {
    type: Array,
    required: true,
  },
  releasedVersion: {
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
  processPage: {
    type: mongoose.Schema.ObjectId,
    ref: "process_page",
    required: true
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "project",
    required: true
  },
});

export default mongoose.model("process_page_release", processPageReleaseSchema);

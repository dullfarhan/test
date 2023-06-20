import mongoose from "mongoose";
const Schema = mongoose.Schema;

const standardProcessTailerHistorySchema = Schema({
  version: {
    type: String,
    require: true,
  },
  tailored_description: {
    type: Object,
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  changeBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  publishAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  standardProcess: {
    type: mongoose.Schema.ObjectId,
    ref: "standard_process",
    required: true
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "project",
    required: true
  },
});

export default mongoose.model("standard_process_tailerhistory", standardProcessTailerHistorySchema);

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const processPagetailerHistorySchema = Schema({
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
  changeUser:{
    type: String,
    require: true,
  },
  publishAt: {
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

export default mongoose.model("process_page_tailerhistory", processPagetailerHistorySchema);

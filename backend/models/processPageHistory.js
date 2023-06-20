import mongoose from "mongoose";
const Schema = mongoose.Schema;

const processPageHistorySchema = Schema({
  version: {
    type: String,
    require: true,
  },
  update_description: {
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
  processPage: {
    type: mongoose.Schema.ObjectId,
    ref: "process_page",
    required: true
  },
});

export default mongoose.model("process_page_history", processPageHistorySchema);

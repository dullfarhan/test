import mongoose from "mongoose";
const Schema = mongoose.Schema;

const standardTemplateHistorySchema = Schema({
  fileURL: {
    type: String,
    require: true,
  },
  label: {
    type: String,
    require: true,
  },
  version: {
    type: String,
    require: false,
  },
  createdBy: {
    type: String,
    require: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  standardProcess: {
    type: mongoose.Schema.ObjectId,
    ref: "standard_process",
    required: true
  }
});



export default mongoose.model("standard_template_history", standardTemplateHistorySchema);

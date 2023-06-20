import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tailerTemplateHistorySchema = Schema({
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
    require: true,
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
  teplateId: { 
    type: mongoose.Schema.ObjectId, 
    ref: "tailer_template", 
    required: true
  },
});



export default mongoose.model("tailer_template_history", tailerTemplateHistorySchema);

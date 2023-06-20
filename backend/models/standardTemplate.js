import mongoose from "mongoose";
const Schema = mongoose.Schema;

const standardTemplateSchema = Schema({
  label: {
    type: String,
    require: true,
  },
  version: {
    type: Array,
    require: true,
  }, //Sample Array [{fileUrl: '', versionNo: '', createdBy: '', createdAt: ''}]
  standardProcess: {
    type: mongoose.Schema.ObjectId,
    ref: "standard_process",
    required: true
  }
});



export default mongoose.model("standard_template", standardTemplateSchema);

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tailerTemplateSchema = Schema({
  label: {
    type: String,
    require: true,
  },
  version: {
    type: Array,
    require: true,
  }, //Sample Array [{fileUrl: '', versionNo: '', createdBy: '', createdAt: ''}]
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "project",
    required: true
  }
});



export default mongoose.model("tailer_template", tailerTemplateSchema);

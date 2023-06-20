import mongoose from "mongoose";
const Schema = mongoose.Schema;

const processPageSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  main_description: {
    type: Array,
    require: true,
  },
  not_in_scope: {
    type: String,
    require: true,
  },
  version : {
    type: String,
    default  :'1.0'
  },
  standardProcess: {
    type: mongoose.Schema.ObjectId,
    ref: "standard_process",
    required: true
  },
});

export default mongoose.model("process_page", processPageSchema);

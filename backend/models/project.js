import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  group: {
    type: Array,
    require: true,
  },
  adminId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  fullName: {
    type: String,
    required: false
  },
  organizationId: {
    type: mongoose.Schema.ObjectId,
    ref: "organization",
    required: true
  },
  organizationName: {
    type: String,
    required: false
  },
  processVersion: {
    type: String,
    require: true,
  },
  processPage:{
    type: Array,
    require: true,
  },
  standardProcess: {
    type: mongoose.Schema.ObjectId,
    ref: "standard_process",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
});


export default mongoose.model("project", projectSchema);

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  member: {
    type: Array,
    require: false,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  organizationId: {
    type: mongoose.Schema.ObjectId, 
    ref: "organization", 
    required: false
  },
});

export default mongoose.model("group", groupSchema);

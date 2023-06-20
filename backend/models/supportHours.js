import mongoose from "mongoose";
const Schema = mongoose.Schema;

const supportHoursSchema = Schema({
  organizationId: {
    type: mongoose.Schema.ObjectId, 
    ref: "organization", 
    required: true
  },
  sessionDate: {
    type: Date, 
    required: true 
  },
  sessionTime: {
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true 
  }
});


export default mongoose.model("support_hours", supportHoursSchema);

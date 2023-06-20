import mongoose from "mongoose";
const Schema = mongoose.Schema;

const organizationSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  numberProject: {
    type: Array,
    require: false,
  },
  numberUsers: {
    type: Array,
    require: false,
  },
  paymentMethod: {
    type: String,
    require: false,
  },
  regEndDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  regStartDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  subStatus: {
    type: String,
    default: "approve",
    require: true,
  },
  subType: {
    type: Object,
    require: false,
  },
  subTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: "subscription_plan",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: false
  },
});

export default mongoose.model("organization", organizationSchema);

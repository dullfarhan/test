import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subscriptionPlanSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  features : {
    type: String,
    require: true,
  },
  description: {
    type: Array,
    require: false,
  },
  price: {
    type: Object,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
});

export default mongoose.model("subscription_plan", subscriptionPlanSchema);

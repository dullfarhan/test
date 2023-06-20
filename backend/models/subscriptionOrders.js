import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subscriptionOrdersSchema = Schema(
  {
    licenses: {
      type: String,
      require: true,
    },
    billingAddress: {
      type: Object,
      default: {},
      require: true,
    },
    companyAddress: {
      type: Object,
      default: {},
      require: true,
    },
    cardDetails: {
      type: Object,
      default: {},
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.ObjectId,
      ref: "organization",
      required: true,
    },
    suportHour: {
      type: Number,
      default: 0,
    },
    subscriptionId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { minimize: false }
);

export default mongoose.model("subscription_orders", subscriptionOrdersSchema);

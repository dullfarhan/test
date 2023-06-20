import SubscriptionPlan from "../models/subscriptionPlan";

export const getAllSubscriptionPlan = async (query) => {
  return await SubscriptionPlan.find(query);
};

export const getOneSubscriptionPlan = async (id) => {
  return await SubscriptionPlan.findById(id);
};

export const addSubscriptionPlan = async (subscriptionPlan) => {
  return await SubscriptionPlan.create(subscriptionPlan);
};

export const updateSubscriptionPlan = async (subscriptionPlan) => {
  return await SubscriptionPlan.findByIdAndUpdate(subscriptionPlan._id, subscriptionPlan);
};

export const deleteSubscriptionPlan = async (id) => {
  return await SubscriptionPlan.findOneAndRemove({ _id: id });
};

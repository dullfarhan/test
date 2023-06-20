import SubscriptionOrders from "../models/subscriptionOrders";

export const getAllSubscriptionOrders = async (query) => {
  return await SubscriptionOrders.find(query);
};

export const getOneSubscriptionOrders = async (id) => {
  return await SubscriptionOrders.findById(id);
};

export const addSubscriptionOrders = async (subscriptionOrders) => {
  return await SubscriptionOrders.create(subscriptionOrders);
};

export const updateSubscriptionOrders = async (subscriptionOrders) => {
  // return await SubscriptionOrders.findByIdAndUpdate(subscriptionOrders._id, subscriptionOrders);
  return await SubscriptionOrders.updateOne(
    { organizationId: subscriptionOrders.oId },  // Query parameter
    { $set: subscriptionOrders }
  )
}

export const deleteSubscriptionOrders = async (id) => {
  return await SubscriptionOrders.findOneAndRemove({ _id: id });
};

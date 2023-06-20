import SupportHours from "../models/supportHours";

export const getAllSupportHours = async (query) => {
  return await SupportHours.find(query);
};

export const getOneSupportHours = async (id) => {
  return await SupportHours.findById(id);
};

export const addSupportHours = async (supportHours) => {
  return await SupportHours.create(supportHours);
};

export const updateSupportHours = async (supportHours) => {
  return await SupportHours.findByIdAndUpdate(supportHours._id, supportHours);
};

export const deleteSupportHours = async (id) => {
  return await SupportHours.findOneAndRemove({ _id: id });
};
